<template>
<div class="user-funds">
	<div class="compact">
		<h1 class="display-4">{{ $t('funds.title') }}</h1>
		<hr>
		<div class="pos-rel">
			<spinner :is-loading="isLoading"></spinner>
			<pre>{{ funds }}</pre>
		</div>
	</div>
</div>
</template>

<script>
import Spinner from '@/components/Spinner';
import HttpService from '@/services/HttpService';

export default {
	name: 'funds',
	data: function () {
		return {
			isLoading: true,
			funds: []
		}
	},
	components: {
		Spinner
	},
	methods: {
		loadData: function () {
			this.isLoading = true;
			return HttpService.Auth.User.getFunds().then((response) => {
				this.funds = response.body;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			})
		}
	},
	mounted: function () {
		this.loadData();
	}
};
</script>

<i18n>
{
	"en": {
		"funds": {
			"title": "Funds"
		}
	},
	"de": {
		"funds": {
			"title": "Guthaben"
		}
	}
}
</i18n>
