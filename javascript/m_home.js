$(function () {
  var baseUrl = '';

  function initChart () {
    var config = {
      type: 'line',
      data: {
        labels: ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '13:30'],
        datasets: [{
          label: '红线说明',
          backgroundColor: '#fa450e',
          borderColor: '#fa450e',
          data: [],
          fill: false,
        }, {
          label: '黄线说明',
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
              display: false,
              labelString: '时间'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: false,
              labelString: '比值'
            }
          }]
        }
      }
    };
    var ctx = document.getElementById('canvas').getContext('2d');
    return new Chart(ctx, config);
  }

  var chart = initChart();

  function fetchOptions (callback) {
    $.ajax({
      type: "GET",
      url: baseUrl + "/web/options",
      success: function (data) {
        if (data) {
          callback && callback(data);
        }
      }
    });
  }

  function renderOptions (data) {
    $('#coinExchangeTime').text(data.coin_exchange_time);
    $('#sellTime').text(data.item_selling_time);
  }

  function fetchHomeInfo (callback) {
    $.ajax({
      type: "GET",
      url: baseUrl + "/web/home",
      success: function (data) {
        if (data) {
          callback && callback(data);
        }
      }
    });
  }

  function renderHomeInfo (data) {
    $('#totalAmount').text(data.total_amount);
    $('#todayAmount').text(data.today_amount);
    $('#coinPrice').text(data.coin_price);
    $('#todayTotalCount').text(data.today_count);
    var daily = data.daily;
    chart.data.labels = daily.labels;
    chart.data.datasets[0].data = daily.amount;
    chart.data.datasets[1].data = daily.coin;
    chart.update();
  }

  function fetchDeviceInfo (callback) {
    $.ajax({
      type: "GET",
      url: baseUrl + '/wap/device/' + id,
      success: function (data) {
        if (data) {
          callback && callback(data);
        }
      }
    });
  }

  function renderDeviceInfo (data) {
    $('#totalCount').text(data.total_count);
    $('#coinExchange').text(data.coin_exchange);
    $('#deviceId').text(data.device_id);
  }

  function main () {
    fetchOptions(renderOptions);
    fetchHomeInfo(renderHomeInfo);
    fetchDeviceInfo(renderDeviceInfo);
  }

  main();

});