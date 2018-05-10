/**
 * Created by Grey on 2018/3/12.
 */

$(function () {

  function initChart () {
    var config = {
      type: 'line',
      data: {
        labels: '',
        datasets: [{
          label: '媒池',
          backgroundColor: '#fa450e',
          borderColor: '#fa450e',
          data: [],
          fill: false,
        }, {
          label: '媒量',
          fill: false,
          backgroundColor: '#e2b329',
          borderColor: '#e2b329',
          data: [],
        }]
      },
      options: {
        responsive: true,
        title: {
          display: false
        },
        tooltips: {
          mode: 'index',
          intersect: false,
        },
        hover: {
          mode: 'nearest',
          intersect: true
        },
        scales: {
          xAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: '时间'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
              labelString: '比值'
            }
          }]
        }
      }
    };
    var ctx = document.getElementById('canvas').getContext('2d');
    var chart = new Chart(ctx, config);
    return chart;
  }
  var chart = initChart();

  function toThousands (num) {
    var num = (num || 0).toString(), result = '';
    while (num.length > 3) {
      result = ',' + num.slice(-3) + result;
      num = num.slice(0, num.length - 3);
    }
    if (num) {
      result = num + result;
    }
    return result;
  }

  function renderData (data) {
    $('#coinPrice').text(data.coin_price + '元');
    $('#todayAmount').text(data.today_amount + '元');
    $('#totalAmount').text(toThousands(data.total_amount) + '元');
    var daily = data.daily;
    chart.data.labels = daily.labels;
    chart.data.datasets[0].data = daily.amount;
    chart.data.datasets[1].data = daily.coin;
    chart.update();
  }

  $.get(baseUrl + '/home', renderData);

  $('#bg-top').nGyroParallax({
    magnification: .01
  });


});

