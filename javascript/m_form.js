$(function () {
  var baseUrl = '';

  var coinExchange = 0;
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
    $('#coinPrice').text(data.coin_price);
    // coinPrice = data.coin_price;
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
    $('#coinExchange').text(data.coin_exchange);
    coinExchange = data.coin_exchange
  }

  function fetchExchange (data, callback) {
    var lock = false
    var req = $.ajax({
      type: "POST",
      data: JSON.stringify(data),
      url: baseUrl + '/wap/exchange',
      success: function (data) {
        if (data) {
          callback && callback(data);
        }
      },
      error: function (error) {
        $('#errMsg').text(error.responseJSON.error.message || '服务器异常');
      },
      beforeSend: function () {
        if (req) {
          req.abort()
        }
        lock = true;
      },
      complete: function () {
        lock = false;
      }
    });
  }

  // $('#exchangeSuccessModal').modal('show');
  function handlerExchange () {
    $('#exchangeForm').submit(function (event) {
      event.preventDefault()
      var count = parseInt($(this).find('input[name=count]').val());
      if (!count) return $('#errMsg').text('请输入兑换数量');
      if (count <= 0 || count > coinExchange) return $('#errMsg').text('请输入范围1 - ' + coinExchange + '的数字');
      $('#errMsg').text('');
      fetchExchange({
        count: count,
        device_id: id
      }, function () {
        $('#exchangeSuccessModal').modal('show');
      });
      return false;
    });
  }

  function main () {
    fetchHomeInfo(renderHomeInfo);
    fetchDeviceInfo(renderDeviceInfo);
    handlerExchange()
  }

  main();
});