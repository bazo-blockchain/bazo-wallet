<template>
<div id="app">
	<main-header></main-header>
	<router-view></router-view>
	<main-footer></main-footer>
</div>
</template>

<script>
import './global.scss';
import MainHeader from '@/components/MainHeader';
import MainFooter from '@/components/MainFooter';

export default {
	name: 'app',
	components: {
		MainHeader,
		MainFooter
	}
};
</script>
