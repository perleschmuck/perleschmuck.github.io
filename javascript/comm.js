/**
 * Created by Grey on 2018/3/29.
 */
$(function () {
  var baseUrl = 'http://dev.wamei.com/api/web';
  // var baseUrl = 'http://wx.888l.com/api/web';
  // var baseUrl = 'http://test.888l.com/api/web';
  var imgUrl = 'http://wx.888l.com';

  window.baseUrl = baseUrl;
  var lock = false;
  var req = $.ajax({
    type: "GET",
    url: baseUrl + "/options",
    success: function (data) {
      $('#tel').html(data.contact_tel);
      $('#hotTel').html('热线：' + data.contact_tel);
      $('#phoneNumer').html(data.contact_tel);
      $('#liveQQ, #qqBtn a').attr('href', 'http://wpa.qq.com/msgrd?v=3&uin=' + data.contact_qq + '&site=qq&menu=yes');
      $('.footer .image.qrcode img, #wmbErCode').attr('src', imgUrl + data.contact_wx_qrcode);
      if ($('#preOrder').length) {
        $('#preOrder').animateNumber({
          number: data.pre_order,
          numberStep: $.animateNumber.numberStepFactories.separator(',')
        }, 3000);
      }
      $('#sellTime').text('开抢时间 ' + data.item_selling_time);
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

  window.fetchGoodsInfo = function (callback) {
    $.ajax({
      url: baseUrl + '/goods',
      success: function (result) {
        if (result) {
          callback(result)
        }
      },
      error: function (error) {
        console.error('异常', error)
      }
    })
  };

  $('#menuBtn').click(function () {
    $('.ui.sidebar')
      .sidebar('toggle');
  });

  $('.footer .two.wide.column').click(function(){
    $(this).toggleClass("on");
  })

});