/**
 * Created by Grey on 2018/3/22.
 */
!function ($) {
  new PCAS("P", "C");
  $(function () {
    var baseUrl = 'http://wx.888l.com/api/web';
    var qrcodeHost = 'http://wx.888l.com';
    var modalAction = function () {
      $('#orderCloseBtn').click(function () {
        $('#paymentModal').modal('hide');
        // window.location.reload()
      });
      return {
        show: function (price, qrcode) {
          $('#totalPrice').text(price || '--');
          $('#payQrcode').attr('src', qrcodeHost + qrcode);
          $('#paymentModal').modal('show');
        }
      }
    };

    var _modalAction = modalAction();

    window.fetchGoodsInfo(function (data) {
      var price = data.price;
      $('#price').text('￥' + price);
      $("#numberAdd").on("click", function () {
        var num = parseInt($('#inputNumber').val());
        if (!isNaN(num)) {
          num++;
          $('#inputNumber').val(num);
          $('#price').text('￥' + num * price)
        } else {
          alert("请输入数字!")
        }
      });
      $('#inputNumber').change(function () {
        var num = parseInt($(this).val());
        $('#inputNumber').val(num);
        $('#price').text('￥' + num * price)
      })
    });

    $("#orderSubmitBtn").click(function () {
      //提交订单
      $("#orderForm").form({
        on: 'blur',
        fields: {
          goods_count: {
            identifier: 'goods_count',
            rules: [
              {
                type: 'number',
                prompt: '请输入数字！'
              }
            ]
          },
          name: {
            identifier: 'name',
            rules: [
              {
                type: 'empty',
                prompt: '请填写您的姓名！'
              }
            ]
          },
          P: {
            identifier: 'P',
            rules: [
              {
                type: 'empty',
                prompt: '请选择所在省份！'
              }
            ]
          },
          C: {
            identifier: 'C',
            rules: [
              {
                type: 'empty',
                prompt: '请选择所在城市！'
              }
            ]
          },
          A: {
            identifier: 'A',
            rules: [
              {
                type: 'empty',
                prompt: '请填写所在具体地址！'
              }
            ]
          },
          mobile: {
            identifier: 'mobile',
            rules: [
              {
                type: 'regExp',
                value: /^(\(\d{3,4}\)|\d{3,4}-|\s)?\d{7,14}$/i,
                prompt: '请填写您的联系电话！'
              }
            ]
          }
        },
        onSuccess: function (event, fields) {
          var datas = {
            "name": fields.name,
            "mobile": fields.mobile,
            "address": fields.P + fields.C + fields.A,
            "remark": fields.remark,
            "goods_id": 1,
            "goods_count": fields.goods_count
          };
          // console.log(datas, '提交数据')
          fetchCreateOrder(datas)
        }
      })
    });

    var loopFetchOrderIsSuccess = function () {};

    function fetchCreateOrder (datas) {
      var lock = false;
      var req = $.ajax({
        type: "POST",
        url: baseUrl + "/orders/create",
        data: JSON.stringify(datas),
        success: function (data) {
          _modalAction.show($('#price').text(), data.qrcode_url);
          loopFetchOrderIsSuccess = setInterval(function () {
            fetchOrderIsSuccess(data.order_id);
          }, 1000);

        },
        error: function (error) {
          // console.log(error, '请求错误！')
        },
        beforeSend: function () {
          if (lock && req) {
            return req.abort();
          }
          lock = true;
        },
        complete: function () {
          lock = false;
        }
      });
    }

    function fetchOrderIsSuccess (orderId) {
      var paymentSuccessModalHeader = $('#paymentSuccessModal-header');
      var paymentSuccessModalContent = $('#paymentSuccessModal-content');
      var paymentSuccessModal = $('#paymentSuccessModal');
      $.ajax({
        type: 'GET',
        url: baseUrl + '/orders/status/' + orderId,
        success: function (response) {
          if (response && response.status && response.status === 'WaitDelivering') {
            paymentSuccessModalHeader.text('支付成功');
            paymentSuccessModalContent.text('恭喜你支付成功！');
            paymentSuccessModal.modal('show');
            clearInterval(loopFetchOrderIsSuccess)
          } else if (response.status !== 'WaitPaying') {
            paymentSuccessModalHeader.text('支付异常');
            paymentSuccessModalContent.text('支付异常, 请查询订单');
            paymentSuccessModal.modal('show');
            clearInterval(loopFetchOrderIsSuccess)
          }
        },
        error: function () {
          paymentSuccessModalHeader.text('支付异常');
          paymentSuccessModalContent.text('服务端异常');
          paymentSuccessModal.modal('show');
          clearInterval(loopFetchOrderIsSuccess)
        }
      })
    }

    $('#paymentSuccessModal .button').click(function () {
      window.location.href = '/wamei_static/help/service_order_search.html'
    });

  })
}(window.jQuery)