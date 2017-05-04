<template>
<div class="admin-server-balance">
	<div class="container">
		<h1 class="display-4">{{ $t('adminServerBalance.title') }}</h1>
		<hr>
		<div v-if="!isLoading">
			<div v-if="balance">
				<pre>{{ balance }}</pre>
			</div>
			<div class="alert alert-warning" v-else>{{ $t('adminServerBalance.error') }}</div>
		</div>
	</div>
</div>
</template>

<script>
import Http from '@/services/Http';

export default {
	name: 'admin-server-balance',
	data: function () {
		return {
			isLoading: false,
			balance: null
		}
	},
	methods: {
		loadData: function () {
			this.isLoading = true;

			Http.adminGetServerBalance().then((response) => {
				this.balance = response.body;
				this.isLoading = false;
			}, () => {
				this.balance = null;
				this.isLoading = false;
			});
		}
	},
	mounted: function () {
		this.loadData();
	},
	i18n: {
		messages: {
			en: {
				adminServerBalance: {
					title: 'Server Balance',
					error: 'The data could not be loaded.'
				}
			},
			de: {
				adminServerBalance: {
					title: 'Server Balance',
					error: 'Die Daten konnten nicht geladen werden.'
				}
			}
		}
	}
};
</script>

<style lang="scss" scoped>

</style>
