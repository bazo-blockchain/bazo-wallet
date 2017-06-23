<template>
<div class="forex">
	<div class="container">
		<h1 class="display-4">{{ $t('forex.title') }}</h1>
		<hr>
		<div class="selectors">
			<div class="selector">
				<label>{{ $t('forex.selectCurrency') }}: </label>
				<b-form-select v-model="selectedCurrency" :options="optionsCurrency" class="md-3"></b-form-select>
			</div>
			<div class="selector">
				<label>{{ $t('forex.selectVendor') }}: </label>
				<b-form-select v-model="selectedVendor" :options="optionsVendor" class="md-3"></b-form-select>
			</div>
		</div>
		<h2 class="display-7">{{ $t('forex.subtitleCurrent') }}</h2>
		<div v-if="!isLoadingCurrent">
			<div v-if="current && current.rate">
				<p class="display-3 price">
					<span class="value">1 BTC = {{ formatCurrency(current.rate) }} {{ current.currencyTo }}</span>
					<span class="date">
						<span class="intro">{{ $t('forex.lastUpdated') }}: </span>
						{{ current.updatedAt | moment(dateFormat) }}
					</span>
				</p>
			</div>
			<div class="no-data" v-else>
				<div class="alert alert-warning">{{ $t('forex.errorCurrent') }}</div>
			</div>
		</div>
		<hr>
		<h2 class="display-7 history-title">{{ $t('forex.subtitleHistory') }}</h2>
		<div class="history" v-if="!isLoadingHistory">	
			<div v-if="history && history.length > 0">
				<div class="last-updated">
					<span class="intro">{{ $t('forex.lastUpdated') }}:</span>
					<span class="date">{{ history[history.length - 1].updatedAt | moment(dateOnlyFormat) }}</span>
				</div>
				<div class="chart-container" data-tz2u8w97hwptfwl3y57ywguux></div>
			</div>
			<div class="no-data" v-else>
				<div class="alert alert-warning">{{ $t('forex.errorHistory') }}</div>
			</div>
			<div class="powered-by">Powered by 
				<a href="http://www.coindesk.com/price/" target="_blank" rel="noopener">CoinDesk</a>/<a href="https://www.bitstamp.net/" target="_blank" rel="noopener">Bitstamp</a>
			</div>
		</div>
	</div>
</div>
</template>

<script>
import HttpService from '@/services/HttpService';
import UtilService from '@/services/UtilService';
import CacheService from '@/services/CacheService';
import Chartist from '@/config/Chartist';
import moment from 'moment';

export default {
	name: 'forex',
	offline: true,

	data: function () {
		return {
			isLoadingCurrent: false,
			isLoadingHistory: false,
			selectedCurrency: 'USD',
			selectedVendor: 'COINDESK',
			optionsVendor: [ 'COINDESK', 'BITSTAMP' ],
			optionsCurrency: [ 'USD', 'EUR', 'CHF' ],
			current: {},
			history: [],
			chart: null
		}
	},
	computed: {
		dateFormat: function () {
			return UtilService.DATE_FORMAT;
		},
		dateOnlyFormat: function () {
			return UtilService.DATE_ONLY_FORMAT;
		}
	},
	methods: {
		loadData: function () {
			this.isLoadingCurrent = true;
			this.isLoadingHistory = true;
			this.clearChart();

			if (this.$store.state.offline) {
				CacheService.getCache('forex', [ 'current', this.selectedVendor, this.selectedCurrency ]).then((value) => {
					this.current = value || {};
					this.isLoadingCurrent = false;
				}, () => {
					this.current = {};
					this.isLoadingCurrent = false;
				});
				CacheService.getCache('forex', [ 'history', this.selectedVendor, this.selectedCurrency ]).then((value) => {
					this.clearChart();
					this.history = value || [];
					this.mountChart();
					this.isLoadingHistory = false;
				}, () => {
					this.history = [];
					this.isLoadingHistory = false;
				});
			} else {
				HttpService.getForexCurrent(this.selectedVendor, this.selectedCurrency, true).then((response) => {
					this.current = response.body;
					CacheService.setCache('forex', this.current, [ 'current', this.selectedVendor, this.selectedCurrency ]);
					this.isLoadingCurrent = false;
				}, () => {
					this.current = {};
					this.isLoadingCurrent = false;
				});

				HttpService.getForexHistory(this.selectedVendor, this.selectedCurrency, true).then((response) => {
					this.clearChart();
					this.history = response.body;
					this.mountChart();
					CacheService.setCache('forex', this.history, [ 'history', this.selectedVendor, this.selectedCurrency ]);
					this.isLoadingHistory = false;
				}, () => {
					this.history = [];
					this.clearChart();
					this.isLoadingHistory = false;
				});
			}
		},
		formatCurrency: UtilService.formatCurrency,
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
		},
		clearChart: function () {
			if (this.chart) {
				this.chart.detach();
				const element = document.querySelector('.chart-container[data-tz2u8w97hwptfwl3y57ywguux]');
				let i = 0;
				if (element && i < 100) {
					while (element.firstChild) {
						element.removeChild(element.firstChild);
						i++;
					}
				}
				this.chart = null;
			}
		}
	},
	mounted: function () {
		this.loadData();
		this.$store.watch((state) => {
			return state.offline;
		}, () => {
			this.loadData();
		});
	},
	watch: {
		selectedCurrency: function () {
			this.loadData();
		},
		selectedVendor: function () {
			this.loadData();
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
.selectors {
	margin-bottom: 15px;
	font-size: 0;
	
	.selector {
		display: inline-block;
		vertical-align: middle;
		white-space: nowrap;
		font-size: 16px;
		margin-bottom: 20px;
		margin-top: 4px;
		
		select {
			margin-left: 10px;
		}
		& + .selector {
			margin-left: 20px;
		}
	}
}
.chart-container {
	padding: 30px 20px;
}
.no-data {
	margin-top: 20px;
}
.powered-by {
	font-size: 12px;
	text-align: right;
	margin-top: 0;
	margin-right: 30px;
	margin-bottom: 20px;
}
.history-title {
	margin-top: 30px;
}
.history {
	.last-updated {
		.intro {
			font-weight: 500;
		}
	}
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


<i18n>
{
	"en": {
		"forex": {
			"title": "Market trend",
			"subtitleCurrent": "Current market price",
			"subtitleHistory": "Trend over the last 30 days",
			"lastUpdated": "Last updated",
			"errorCurrent": "The market price could not be loaded.",
			"errorHistory": "The trend over the last 30 days could not be loaded. There may be no data available from this vendor.",
			"selectCurrency": "Select currency",
			"selectVendor": "Select vendor"
		}
	},
	"de": {
		"forex": {
			"title": "Kursentwicklung",
			"subtitleCurrent": "Aktueller Kurs",
			"subtitleHistory": "Kursentwicklung der letzten 30 Tage",
			"lastUpdated": "Letztes Update",
			"errorCurrent": "Der Kurs konnte nicht geladen werden.",
			"errorHistory": "Die Kursentwicklung der letzten 30 Tage konnte nicht geladen werden. Möglicherweise stellt dieser Anbieter keine Daten zur Verfügung.",
			"selectCurrency": "Währung wählen",
			"selectVendor": "Anbieter wählen"
		}
	}
}
</i18n>
