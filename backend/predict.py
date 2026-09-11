import warnings
import os
import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import pickle
from pandas.tseries.offsets import DateOffset

warnings.filterwarnings("ignore")
plt.style.use('fivethirtyeight')
matplotlib.rcParams['axes.labelsize'] = 14
matplotlib.rcParams['xtick.labelsize'] = 12
matplotlib.rcParams['ytick.labelsize'] = 12
matplotlib.rcParams['text.color'] = 'k'

APP_ROOT = os.path.dirname(os.path.abspath(__file__))


def run_prediction(n: int) -> None:
    """Forecast `n` months ahead and write plot_forecast.png. Runs in-process
    (called directly from the Flask request handler) so there's no subprocess
    spawn and no self-HTTP callback into the server that's calling it."""
    with open(os.path.join(APP_ROOT, 'result_pickle'), 'rb') as f:
        pres = pickle.load(f)

    # use whatever was most recently uploaded, falling back to the bundled sample
    uploaded_csv = os.path.join(APP_ROOT, 'uploaded_data.csv')
    csv_path = uploaded_csv if os.path.exists(uploaded_csv) else os.path.join(APP_ROOT, 'Super_Store.csv')
    furniture = pd.read_csv(csv_path, encoding='latin-1')

    cols = ['Row ID', 'Order ID', 'Ship Date', 'Ship Mode', 'Customer ID', 'Customer Name', 'Segment', 'Country', 'City', 'State', 'Postal Code', 'Region', 'Product ID', 'Category', 'Sub-Category', 'Product Name', 'Quantity', 'Discount', 'Profit']
    furniture = furniture[['Order Date', 'Sales']] if set(['Order Date', 'Sales']).issubset(furniture.columns) else furniture.drop(cols, axis=1, errors='ignore')
    furniture = furniture.sort_values('Order Date')
    furniture = furniture.groupby("Order Date")['Sales'].sum().reset_index()
    furniture["Order Date"] = pd.to_datetime(furniture["Order Date"])
    furniture.set_index("Order Date", inplace=True)
    y = furniture["Sales"].resample('MS').mean()

    future_data = [y.index[-1] + DateOffset(months=x) for x in range(0, n)]
    future_data_df = pd.DataFrame(index=future_data[0:], columns=furniture.columns)

    pred_uc = pres.get_forecast(steps=n)
    pred_ci = pred_uc.conf_int()
    ax = y.plot(label='observed', figsize=(14, 7))
    pred_uc.predicted_mean.plot(ax=ax, label='Forecast')

    future_data_df = pred_ci
    future_data_df['forecasted sales'] = future_data_df[['lower Sales', 'upper Sales']].mean(axis=1)
    future_df = pd.concat([y, future_data_df])
    future_df = future_df.rename(columns={0: 'sales'})
    future_df[['Sales', 'forecasted sales']].plot(figsize=(12, 8))
    future_df.replace(np.nan, 0)
    future_df.fillna(0, inplace=True)

    plt.savefig(os.path.join(APP_ROOT, "plot_forecast.png"))
    plt.close('all')
