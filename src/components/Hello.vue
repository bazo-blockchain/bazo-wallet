<template>
<div class="hello">
	<router-link :to="{ name: 'secure'}">Go To Secure Page</router-link> |
	<a @click="admin">Call Secure Admin function</a>
	
	<div class="previous-stuff">
		<img src="../assets/logo.png">
		<h1>{{ msg }}</h1>
		<h2>Essential Links</h2>
		<ul>
			<li><a href="https://vuejs.org" target="_blank">Core Docs</a></li>
			<li><a href="https://forum.vuejs.org" target="_blank">Forum</a></li>
			<li><a href="https://gitter.im/vuejs/vue" target="_blank">Gitter Chat</a></li>
			<li><a href="https://twitter.com/vuejs" target="_blank">Twitter</a></li>
			<br>
			<li><a href="http://vuejs-templates.github.io/webpack/" target="_blank">Docs for This Template</a></li>
		</ul>
		<h2>Ecosystem</h2>
		<ul>
			<li><a href="http://router.vuejs.org/" target="_blank">vue-router</a></li>
			<li><a href="http://vuex.vuejs.org/" target="_blank">vuex</a></li>
			<li><a href="http://vue-loader.vuejs.org/" target="_blank">vue-loader</a></li>
			<li><a href="https://github.com/vuejs/awesome-vue" target="_blank">awesome-vue</a></li>
		</ul>
	</div>
</div>
</template>

<script>
import Auth from '../services/Auth';
import Http from '../services/Http';

export default {
	name: 'hello',
	data () {
		return {
			msg: 'Welcome to Your Vue.js App'
		}
	},
	methods: {
		logout: function () {
			Auth.logout();
		},
		admin: function () {
			Http.adminGetAccounts(this).then(function (response) {
				console.log(response);
			});
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
h1, h2 {
	font-weight: normal;
}

ul {
	list-style-type: none;
	padding: 0;
}

li {
	display: inline-block;
	margin: 0 10px;
}

a {
	color: #42b983;
}

.previous-stuff {
	border: 1px solid #666;
	margin: 40px;
	position: relative;
	padding: 10px;
	&:before {
		content: "PREVIOUS STUFF";
		position: absolute;
		top: -0.5em;
		left: 2em;
		padding: 0 0.5em;
		background: white;
	}
}
</style>
