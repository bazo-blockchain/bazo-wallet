<template>
<div id="app">
	<progress-bar></progress-bar>
	<main-header></main-header>
	<router-view></router-view>
	<main-footer></main-footer>
</div>
</template>

<script>
import MainHeader from '@/components/MainHeader';
import MainFooter from '@/components/MainFooter';
import ProgressBar from '@/components/ProgressBar';

export default {
	name: 'app',
	components: {
		ProgressBar
		MainHeader,
		MainFooter,
	}
};
</script>
