import warnings
import itertools
import pandas as pd
import numpy as np
import statsmodels.api as sm
import seaborn as sns
import requests
import json
import matplotlib
import matplotlib.pyplot as plt
import pickle
warnings.filterwarnings("ignore")
plt.style.use('fivethirtyeight')
matplotlib.rcParams['axes.labelsize']=14
matplotlib.rcParams['xtick.labelsize']=12
matplotlib.rcParams['ytick.labelsize']=12
matplotlib.rcParams['text.color']='k'

with open('result_pickle','rb') as f:
    pres=pickle.load(f)
#get dataset
r=requests.get('http://localhost:5000/get_file')
r=r.text
df=json.loads(r)
furniture = pd.DataFrame.from_dict(df['Super_Store.csv'])
cols = ['Row ID', 'Order ID', 'Ship Date', 'Ship Mode', 'Customer ID', 'Customer Name', 'Segment', 'Country', 'City', 'State', 'Postal Code', 'Region', 'Product ID', 'Category', 'Sub-Category', 'Product Name', 'Quantity', 'Discount', 'Profit']
furniture.drop(cols, axis = 1, inplace = True)
furniture = furniture.sort_values('Order Date')
furniture = furniture.groupby("Order Date")['Sales'].sum().reset_index()
furniture["Order Date"] = pd.to_datetime(furniture["Order Date"])
furniture.set_index("Order Date", inplace = True)
y = furniture["Sales"].resample('MS').mean()
#get predict month
rn=requests.get('http://localhost:5000/get_input')
rn=rn.text
jn=json.loads(rn)
n=jn['n']
n=int(n)
#future data
from pandas.tseries.offsets import DateOffset
future_data = [y.index[-1] + DateOffset(months = x) for x in range(0,n)]
future_data_df = pd.DataFrame(index = future_data[0:],columns = furniture.columns)
#prediction
pred_uc = pres.get_forecast(steps=n)
pred_ci = pred_uc.conf_int()
ax = y.plot(label='observed', figsize=(14, 7))
pred_uc.predicted_mean.plot(ax=ax, label='Forecast')
'''
ax.fill_between(pred_ci.index, pred_ci.iloc[:, 0], pred_ci.iloc[:, 1], color='k', alpha=.25)
ax.set_xlabel('Date')
ax.set_ylabel('Furniture Sales')
plt.legend()
plt.show()'''
print(pred_ci)
#output data
future_data_df=pred_ci
future_data_df['forecasted sales'] = future_data_df[['lower Sales', 'upper Sales']].mean(axis=1)
future_df = pd.concat([y,future_data_df])
future_df=future_df.rename(columns={0:'sales'})
future_df[['sales','forecasted sales']].plot(figsize=(12,8))
future_df.replace(np.nan,0)
print("predicted")
future_df.fillna(0,inplace=True)
print(future_df.isnull().sum())
print(future_df)
plt.savefig("plot_forecast.png")
#data['forecast']=future_data_df.to_dict()
sent = {"file":future_df.to_csv()}
requests.post('http://localhost:5000/upload_file',files=sent)