/**
 * Created by Grey on 2018/3/22.
 */
!function ($) {
  $(function () {
    var baseUrl = 'http://wx.888l.com/api/web';
    var modalAction = function () {
      $('.ui.modal .button').click(function () {
        $('.ui.modal').modal('hide')
        window.location.reload()
      })
      return {
        show: function () {
          $('.ui.modal').modal('show')
        }
      }
    }
    var _modalAction = modalAction()
    var fields = {
      name: {
        identifier: 'name',
        rules: [
          {
            type: 'empty',
            prompt: '名字不能为空！'
          }
        ]
      },
      corp_name: {
        identifier: 'corp_name',
        depends: 'u',
        rules: [
          {
            type: 'empty',
            prompt: '名字不能为空！'
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
      },
      email: {
        identifier: 'email',
        rules: [
          {
            type: 'email',
            prompt: 'email格式不对！'
          }
        ]
      },
    }
    $("#contactForm input[name='u']").on("click", function (event) {
      if (event.target.checked) {
        $("#contactForm input[name='corp_name']").parent().removeClass('disabled error')
      } else {
        $("#contactForm input[name='corp_name']").parent().addClass('disabled').removeClass('error')
      }
    })

    function getPageName () {
      var hrefArr = window.location.href.split('/');
      var fullName = hrefArr[hrefArr.length - 1];
      return fullName.split('.')[0];
    }

    var pageName = getPageName();

    // console.log('pageName: ', pageName);

    $("#reservationBtn").on("click", function (event) {
      //提交预约
      $("#contactForm").form({
        on: 'blur',
        fields: fields,
        onSuccess: function (event, fields) {
          var datas = {
            "name": fields.name,
            "corp_name": fields.u ? fields.corp_name : '',
            "mobile": fields.mobile,
            "email": fields.email,
            "source": pageName
          };
          var lock = false;
          var req = $.ajax({
            type: "POST",
            url: baseUrl + "/customs",
            data: JSON.stringify(datas),
            success: function (data) {
              _modalAction.show();
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
      })
    });
  })
}(window.jQuery)