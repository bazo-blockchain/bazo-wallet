<template>
	<top-progress ref="topProgress" color="rgb(34, 221, 131)"></top-progress>
</template>

<script>
import topProgress from 'vue-top-progress';
import EventBus from '../services/EventBus';

export default {
	name: 'progress-bar',
	mounted () {
		EventBus.$on('globalProgressBar', (parameter) => {
			this.$refs.topProgress[parameter]();
		});
	},
	components: {
		topProgress
	}
}
</script>
