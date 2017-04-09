<template>
	<div class="admin-accounts">
		<h1>{{ $t('adminAccounts.title') }}</h1>
		{{ msg }}
	</div>
</template>

<script>
export default {
	name: 'admin-accounts',
	data: () => {
		return {
			msg: 'hello'
		}
	},
	i18n: {
		messages: {
			en: {
				adminAccounts: {
					title: 'Account overview'
				}
			},
			de: {
				adminAccounts: {
					title: 'Kontoübersicht'
				}
			}
		}
	}
};
</script>
