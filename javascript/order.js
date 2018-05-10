/**
 * Created by Grey on 2018/3/22.
 */
!function ($) {
  new PCAS("P", "C");
  $(function () {
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
    // $('#paymentModal').modal('show')

    var modalAction = function () {
      $('#orderCloseBtn').click(function () {
        $('#paymentModal').modal('hide');
        // window.location.reload()
      });
      return {
        show: function (price) {
          $('#totalPrice').text(price || '--');
          $('#paymentModal').modal('show');
        }
      }
    };
    // $('#paymentSuccessModal').modal('show');
    $('#paymentSuccessModal .button').click(function () {
      window.location.reload();
    });
    var _modalAction = modalAction();
    var baseUrl = 'http://test.888l.com/api/web';
    $("#orderSubmitBtn").on("click", function () {
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
          }
          console.log(datas, '提交数据')
          fetchCreateOrder(datas)
        }
      })
    });

    function fetchCreateOrder (datas) {
      var lock = false
      var req = $.ajax({
        type: "POST",
        url: baseUrl + "/orders/create",
        data: JSON.stringify(datas),
        success: function (data) {
          console.log(data, '----data')
          _modalAction.show($('#price').text())
        },
        error: function (error) {
          console.log(error, '请求错误！')
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

  })
}(window.jQuery)