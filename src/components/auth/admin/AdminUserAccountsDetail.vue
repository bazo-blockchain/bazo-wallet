<template>
<div class="admin-user-accounts-detail">
	<div class="compact">
		<h1 class="display-4">
			{{ $t('adminUserAccountsDetail.title') }}
			<small class="text-muted">{{ email }}</small>
		</h1>
		<hr>
		<div v-if="!isLoading">
			<table class="table table-striped" v-if="userAccount.email">
				<tbody>
					<tr>
						<th scope="row">{{ $t('adminUserAccountsDetail.fields.email') }}</th>
						<td>{{ userAccount.email }}</td>
					</tr>
					<tr>
						<th scope="row">{{ $t('adminUserAccountsDetail.fields.userRole') }}</th>
						<td>
							<button class="btn btn-sm btn-primary translucent" @click="switchRole" v-if="userAccount.userRole !== 'ROLE_ADMIN' && !userIsViewingHimself">ADMIN</button>
							<button class="btn btn-sm btn-primary no-pointer" v-if="userAccount.userRole === 'ROLE_ADMIN'">ADMIN</button>
							<button class="btn btn-sm btn-primary translucent" @click="switchRole" v-if="userAccount.userRole !== 'ROLE_USER' && !userIsViewingHimself">USER</button>
							<button class="btn btn-sm btn-primary no-pointer" v-if="userAccount.userRole === 'ROLE_USER'">USER</button>
						</td>
					</tr>
					<tr>
						<th scope="row">{{ $t('adminUserAccountsDetail.fields.creationDate') }}</th>
						<td>{{ userAccount.creationDate | moment(dateFormat) }}</td>
					</tr>
					<tr>
						<th scope="row">{{ $t('adminUserAccountsDetail.fields.balance') }}</th>
						<td>{{ userAccount.balance }}</td>
					</tr>
					<tr>
						<th scope="row">{{ $t('adminUserAccountsDetail.fields.deleted') }}</th>
						<td>
							<span v-html="userAccount.deleted ? $t('adminUserAccountsDetail.deletedYes') : $t('adminUserAccountsDetail.deletedNo')"></span>
							<button v-if="!userAccount.deleted && !userIsViewingHimself" class="btn btn-danger btn-sm" @click="deleteUser">
								<i class="fa fa-times"></i>
								{{ $t('adminUserAccountsDetail.deleteButton') }}
							</button>
							<button v-if="userAccount.deleted && !userIsViewingHimself" class="btn btn-success btn-sm" @click="undeleteUser">
								<i class="fa fa-undo"></i>
								{{ $t('adminUserAccountsDetail.undeleteButton') }}
							</button>
						</td>
					</tr>
					<tr>
						<th scope="row">{{ $t('adminUserAccountsDetail.fields.account') }}</th>
						<td>
							<span v-if="userAccount.accountPublicKeyClient" class="short-key-extended">
								<router-link :to="{ name: 'admin-accounts-detail', params: { publicKeyClient: userAccount.accountPublicKeyClient } }">
									{{ userAccount.accountPublicKeyClient }}
								</router-link>
							</span>
							<span v-else>
								<i class="fa fa-minus"></i>
							</span>
						</td>
					</tr>
				</tbody>
			</table>
			<div v-else class="alert alert-warning">
				<b>{{ $t('adminUserAccountsDetail.noUserFoundTitle') }}</b>
				{{ $t('adminUserAccountsDetail.noUserFound') }}
			</div>
		</div>
	</div>
</div>
</template>

<script>
import HttpService from '@/services/HttpService';
import UtilService from '@/services/UtilService';

export default {
	name: 'admin-user-accounts-detail',
	data () {
		return {
			isLoading: false,
			userAccount: {}
		}
	},
	props: {
		email: String
	},
	computed: {
		userIsViewingHimself: function () {
			return this.$store.state.user.email === this.userAccount.email;
		},
		dateFormat: function () {
			return UtilService.DATE_FORMAT;
		}
	},
	watch: {
		// necessary, if somebody changes the URL, and the view is not rerendered completely
		email: function () {
			this.userAccount = {};
			this.loadData();
		}
	},
	mounted: function () {
		this.loadData();
	},
	methods: {
		loadData: function () {
			this.isLoading = true;
			HttpService.Auth.Admin.getUserAccount(this.email, true).then((response) => {
				this.userAccount = response.body;
				this.isLoading = false;
			}, () => {
				this.isLoading = false;
			});
		},
		switchRole: function () {
			this.isLoading = true;
			HttpService.Auth.Admin.switchUserRole(this.email).then(() => {
				this.loadData();
				this.$toasted.global.success(this.$t('adminUserAccountsDetail.successRoleChange'));
			}, () => {
				this.$toasted.global.error(this.$t('adminUserAccountsDetail.error'));
				this.loadData();
			});
		},
		deleteUser: function () {
			this.isLoading = true;
			HttpService.Auth.Admin.deleteUser(this.email).then(() => {
				this.$toasted.global.success(this.$t('adminUserAccountsDetail.successDelete'));
				this.loadData();
			}, () => {
				this.$toasted.global.error(this.$t('adminUserAccountsDetail.error'));
				this.loadData();
			});
		},
		undeleteUser: function () {
			this.isLoading = true;
			HttpService.Auth.Admin.undeleteUser(this.email).then(() => {
				this.$toasted.global.success(this.$t('adminUserAccountsDetail.successUndelete'));
				this.loadData();
			}, () => {
				this.$toasted.global.error(this.$t('adminUserAccountsDetail.error'));
				this.loadData();
			});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.table {
	width: auto;
}
.display-4 small {
	font-size: 70%;
}
.btn.btn-danger,
.btn.btn-success {
	margin-left: 40px;
}
</style>

<i18n>
{
	"en": {
		"adminUserAccountsDetail": {
			"title": "User Account",
			"deleteButton": "Delete!",
			"undeleteButton": "Undo",
			"deletedYes": "Yes",
			"deletedNo": "No",
			"noUserFoundTitle": "Attention:",
			"noUserFound": "No user with this e-mail address was found.",
			"error": "An error occurred. Please try it again later.",
			"successRoleChange": "The user role was successfully changed.",
			"successDelete": "The user was successfully marked as deleted.",
			"successUndelete": "The user was successfully marked as&nbsp;<b>not</b>&nbsp;deleted.",
			"fields": {
				"email": "E-Mail",
				"userRole": "User Role",
				"creationDate": "Creation Date",
				"balance": "Balance",
				"deleted": "Deleted?",
				"account": "Account"
			}
		}
	},
	"de": {
		"adminUserAccountsDetail": {
			"title": "Benutzerkonto",
			"deleteButton": "Löschen!",
			"undeleteButton": "Rückgängig machen",
			"deletedYes": "Ja",
			"deletedNo": "Nein",
			"noUserFoundTitle": "Achtung:",
			"noUserFound": "Es wurde kein Benutzer mit dieser E-Mail Adresse gefunden.",
			"error": "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.",
			"successRoleChange": "Die Benutzerrolle wurde erfolgreich gewechselt.",
			"successDelete": "Der Benutzer wurde erfolgreich als gelöscht markiert.",
			"successUndelete": "Der Benutzer wurde erfolgreich als&nbsp;<b>nicht</b>&nbsp;gelöscht markiert.",
			"fields": {
				"email": "E-Mail Adresse",
				"userRole": "Benutzerrolle",
				"creationDate": "Erstelldatum",
				"balance": "Saldo",
				"deleted": "Gelöscht?",
				"account": "Konto"
			}
		}
	}
}
</i18n>
