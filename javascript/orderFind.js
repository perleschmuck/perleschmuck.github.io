/**
 * Created by Grey on 2018/4/3.
 */
$(function () {
  // alert(1)
  var baseUrl = 'http://wx.888l.com/api/web';
  function reloadImgCode () {
    var $imgCode = $('#imgCode');
    $imgCode.attr('src', 'http://wx.888l.com/api/captcha' + '?_=' + Math.random());
  }

  function ajaxSetup () {
    var lock = false;
    var req = $.ajaxSetup({
      beforeSend: function () {
        if (lock) {
          req.abort()
        }
        lock = true;
      },
      complete: function () {
        lock = false;
      }
    });
  }
  ajaxSetup();

  var _data = {};
  function checkingData (callback) {
    $("#orderSearchForm").form({
      on: 'blur',
      fields: {
        mobile: {
          identifier: 'mobile',
          rules: [
            {
              type: 'regExp',
              value: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/i,
              prompt: '请填写您的联系电话！'
            }
          ]
        },
        code: {
          identifier: 'code',
          rules: [
            {
              type: 'empty',
              prompt: '输入验证码！'
            }
          ]
        }
      },
      onSuccess: function (event, fields) {
        event.preventDefault();
        var datas = {
          "mobile": fields.mobile,
          "code": fields.code
        };
        fetchCheckingImgCode(datas);
      }
    });
  }

  function fetchCheckingImgCode (data, callback) {
    $.ajax({
      type: 'POST',
      url: baseUrl + '/orders/code',
      xhrFields: {
        withCredentials: true
      },
      data: JSON.stringify(data),
      success: function (result) {
        _data.mobile = data.mobile;
        $('#imgCodeInfo').text('');
        $('#orderSearchForm').get(0).reset()
        $('#phoneCodeModal').modal('show');
      },
      error: function (error, data) {
        var msg = '服务端异常';
        try {
          msg = error.responseJSON.error.message;
        } catch (e) { }
        $('#imgCodeInfo').text(msg)
      }
    })
  }

  function checkingPhoneCode () {
    $("#phoneCodeModalForm").form({
      on: 'blur',
      fields: {
        code: {
          identifier: 'code',
          rules: [
            {
              type: 'empty',
              prompt: '输入验证码！'
            }
          ]
        }
      },
      onSuccess: function (event, fields) {
        event.preventDefault();
        var datas = {
          "code": fields.code
        };

        fetchQueryOrder(datas.code);
      }
    });
  }
  // fetchQueryOrder()
  function fetchQueryOrder (code) {
    _data.code = code;
    // _data = {
    //   mobile: 18982160699,
    //   code: 123
    // }
    $.ajax({
      type: 'POST',
      url: baseUrl + '/orders/find',
      xhrFields: {
        withCredentials: true
      },
      data: JSON.stringify(_data),
      success: function (result) {
        renderOrderList(result);
        $('#phoneCodeInfo').text('');
        $('#phoneCodeModalForm').get(0).reset()
        $('#phoneCodeModal').modal('hide');
      },
      error: function (error, data) {
        var msg = '服务端异常';
        try {
          msg = error.responseJSON.error.message;
        } catch (e) { }
        $('#phoneCodeInfo').text(msg)
      }
    })
  }
  // fetchQueryOrder(1)
  // renderOrderList([{}])
  function renderOrderList (data) {
    var html = '';
    var temp = '' +
      '<div class="order-view">'+
        '<div class="order-title">订单号：{order_id} <span>快递信息：{express_name}，{express_id}</span></div>'+
        '<div class="order-table">'+
          '<div>'+
            '<span>商品名</span>'+
            '<span>价格</span>'+
            '<span>支付状态</span>'+
            '<span>购买时间</span>'+
            '<span>电话号码</span>'+
            '<span>地址</span>'+
            '<span>购买者</span>'+
          '</div>'+
          '<div>'+
            '<span>{goods_name}</span>'+
            '<span>{goods_price}</span>'+
            '<span>{status}</span>'+
            '<span>{purchase_time}</span>'+
            '<span>{mobile}</span>'+
            '<span>{address}</span>'+
            '<span>{name}</span>'+
          '</div>'+
        '</div>'+
      '</div>';
    for (var i = 0, l = data.length; i < l; i++) {
      var item = data[i];
      html += temp.replace(/\{(.+?)\}/g, function (m, m1) {
        return item[m1] || '--';
      })
    }
    $('#orderViewBox').html(html);
  }

  $('#phoneCodeModalCloseBtn').click(function () {
    $('#phoneCodeModal').modal('hide');
  });

  $('#checkingBtn').on('click', checkingData);

  $("#changeVcode").on('click', reloadImgCode);

  $('#phoneCodeModal button').on('click', checkingPhoneCode)


});