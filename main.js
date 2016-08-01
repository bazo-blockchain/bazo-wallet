var request = window.superagent;
var vm = new Vue({
  el: '#app',
  data: {
    message: ''
  },
  methods: {
    rate: function() {
      request
        .get('/test')
        .end(function(err, res){
           vm.message = res.body.rate;
        });
      }
  }
})
vm.rate()
