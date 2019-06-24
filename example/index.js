var opts = {
  segments: [
    {
      color: 'red',
      onSelected: function() {
        console.log('weeee red was selected')
      }
    }
  ,
    {
      color: 'blue',
      onSelected: function() {
        console.log('blue twas selected')
      }
    }
  ,
    {
      color: 'yellow',
      onSelected: function() {
        console.log('bleh yellow')
      }
    }
  ,
    {
      color: 'green'
    }
  ,
    {
      color: 'black'
    }
  ,
    {
      color: 'pink'
    }
  ]
,
  onFinish: function(segment) {
    console.log(segment);
  }
}

var spinner = new WinnerSpinner(opts);

function spin(){
  spinner.spin();
}