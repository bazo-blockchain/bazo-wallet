<template>
<div class="forex">
	<div class="container">
		<h1 class="display-4">{{ $t('forex.title') }}</h1>
		<hr>
		<div v-if="!isLoading">
			<div class="currency-selector">
				<label>{{ $t('forex.selectCurrency') }}: </label>
				<b-form-select v-model="selectedCurrencyCurrent" :options="optionsCurrency" class="md-3"></b-form-select>
			</div>
			<div class="currency-vendor">
				<label>{{ $t('forex.selectVendor') }}: </label>
				<b-form-select v-model="selectedVendorCurrent" :options="optionsVendor" class="md-3"></b-form-select>
			</div>
			<div v-if="current.rate">
				<h2 class="display-7">{{ $t('forex.subtitleCurrent') }}</h2>
				<p class="display-3 price">
					<span class="value">1 BTC = {{ formatCurrency(current.rate) }} {{ current.currencyTo }}</span>
					<span class="date">
						<span class="intro">{{ $t('forex.lastUpdated') }}: </span>
						{{ current.updatedAt | moment(dateFormat) }}
					</span>
				</p>
			</div>
			<div class="alert alert-warning" v-else>{{ $t('forex.errorCurrent') }}</div>
			<hr>
			<div class="history" v-if="history.length > 0">
				<div class="currency-selector">
					<label>{{ $t('forex.selectCurrency') }}: </label>
					<b-form-select v-model="selectedCurrencyHistory" :options="optionsCurrency" class="md-3"></b-form-select>
				</div>
				<div class="currency-vendor">
					<b-form-select v-model="selectedVendorHistory" :options="optionsVendor" :disabled="true" class="md-3"></b-form-select>
				</div>
				<h2 class="display-7">{{ $t('forex.subtitleHistory') }}</h2>
				<div class="chart-container" data-tz2u8w97hwptfwl3y57ywguux></div>
			</div>
			<div class="alert alert-warning" v-else>{{ $t('forex.errorHistory') }}</div>
			<div class="powered-by">Powered by 
				<a href="http://www.coindesk.com/price/" target="_blank">CoinDesk</a>/<a href="https://www.bitstamp.net/" target="_blank">Bitstamp</a>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import Http from '@/services/Http';
import Util from '@/services/Util';
import Chartist from '@/config/Chartist';
import moment from 'moment';

export default {
	name: 'forex',
	data: function () {
		return {
			isLoading: false,
			selectedCurrencyCurrent: 'USD',
			selectedCurrencyHistory: 'USD',
			selectedVendorCurrent: 'COINDESK',
			selectedVendorHistory: 'COINDESK',
			optionsVendor: [ 'COINDESK', 'BITSTAMP' ],
			optionsCurrency: [ 'USD', 'EUR', 'CHF' ],
			current: {},
			history: [],
			chart: null
		}
	},
	computed: {
		dateFormat: function () {
			return Util.DATE_FORMAT;
		}
	},
	methods: {
		loadData: function () {
			this.isLoading = true;

			Promise.all([
				Http.getForexCurrent(this.selectedVendorCurrent, this.selectedCurrencyCurrent),
				Http.getForexHistory(this.selectedVendorHistory, this.selectedCurrencyHistory)
			]).then((responses) => {
				this.current = responses[0].body;
				this.history = responses[1].body;
				this.mountChart();
				this.isLoading = false;
			}, () => {
				this.current = {};
				this.history = [];
				this.isLoading = false;
			});
		},
		formatCurrency: Util.formatCurrency,
		mountChart: function () {
			const chartData = [];
			for (let i = 0; i < this.history.length; i++) {
				chartData.push({
					x: moment(this.history[i].updatedAt).toDate(),
					y: this.history[i].rate
				});
			}
			window.setTimeout(() => {
				this.chart = Chartist.Line('.chart-container[data-tz2u8w97hwptfwl3y57ywguux]', {
					labels: chartData,
					series: [ {
						name: 'rates',
						data: chartData
					} ]
				}, {
					height: '350px',
					showArea: true,
					axisX: {
						type: Chartist.FixedScaleAxis,
						divisor: 10,
						labelInterpolationFnc: (value) => {
							return moment(value).format('MMM D');
						}
					}
				});
			}, 100);
		}
	},
	watch: {
		selectedCurrencyCurrent: function () {
			this.loadData();
		},
		selectedCurrencyHistory: function () {
			this.loadData();
		},
		selectedVendorCurrent: function () {
			this.loadData();
		}
	},
	mounted: function () {
		this.loadData();
	},
	i18n: {
		messages: {
			en: {
				forex: {
					title: 'Market trend',
					subtitleCurrent: 'Current market price',
					subtitleHistory: 'Trend over the last 30 days',
					lastUpdated: 'Last updated',
					errorCurrent: 'The current market price could not be loaded.',
					errorHistory: 'The trend over the last 30 days could not be loaded.',
					selectCurrency: 'Select currency',
					selectVendor: 'Select vendor'
				}
			},
			de: {
				forex: {
					title: 'Kursentwicklung',
					subtitleCurrent: 'Aktueller Kurs',
					subtitleHistory: 'Kursentwicklung der letzten 30 Tage',
					lastUpdated: 'Letztes Update',
					errorCurrent: 'Der aktuelle Kurs konnte nicht geladen werden.',
					errorHistory: 'Die Kursentwicklung der letzten 30 Tage konnte nicht geladen werden',
					selectCurrency: 'Währung wählen',
					selectVendor: 'Anbieter wählen'
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.price {
	display: inline-block;
	padding: 0.3em 0.7em;
	border-left: 5px solid grey;
	font-size: 56px;
	margin: 0.3em 1em;
	
	.date {
		font-size: 16px;
		display: block;
		margin-top: 10px;
		.intro {
			font-weight: 500;
		}
	}
}
.currency-selector {
	float: right;
	padding-left: 25px;
	select {
		margin-left: 10px;
	}
}
.currency-vendor {
	float: right;
	select {
		margin-left: 10px;
	}
}
.chart-container {
	padding: 30px 20px;
}
.powered-by {
	font-size: 12px;
	text-align: right;
	margin-top: 10px;
	margin-right: 30px;
}
.history {
	margin-top: 30px;
}

@media screen and (max-width: 1000px) {
	.price {
		font-size: 24px;
		.date {
			font-size: 14px;
		}
	}
}
</style>

<style lang="scss">
.chart-container[data-tz2u8w97hwptfwl3y57ywguux] .ct-series-a {
	$color: #1aa22f;
	
	.ct-line,
	.ct-point {
		stroke: $color;
	}
	.ct-area {
		fill: $color;
	}
}
</style>
