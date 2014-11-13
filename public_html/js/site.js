var my_interests = ['Хоккей', 'Высокоточная вёрстка под старые версии Microsoft Internet Explorer, начиная с версии 5.01'];
var friend_interests = ['Баскетбол', 'Нарезка Photoshop/Fireworks макетов на скорость, в экстремальных условиях, на природе'];

$(document).ready(function () {
    var InterestActions = (function () {
        var _generateInterest = function (list, name, isMine) {
            var li = $('<li class="b-interest-list__element"/>').appendTo(list);
            var interest = $('<div class="b-interest"/>')
                    .appendTo(li);
            $('<a class="b-interest__control"/>')
                    .attr('href', '')
                    .appendTo(interest);
            if (!isMine) {
                $('<a class="b-interest__complain b-interest__complain_hidden" />')
                        .attr('href', '')
                        .text('пожаловаться')
                        .appendTo(interest);
            }
            var interest_name = $('<div class="b-interest__name"/>')
                    .appendTo(interest);
            $('<div class="b-interest__text"/>')
                    .text(name)
                    .appendTo(interest_name);
            $('<div class="b-interest__fader"/>')
                    .addClass('info_fader')
                    .appendTo(interest_name);
            if (!isMine) {
                $('<div class="b-interest__added b-interest__added_hidden"/>')
                        .text('добавлено в ваши увлечения')
                        .appendTo(interest_name);
            }
        };
        return {
            addInterest: function (name) {
                if (name.length < 1) {
                    $('#info_add_alert').text('Поле ввода пустое!');
                    return;
                }
                for (var i = 0, len = my_interests.length; i < len; i++) {
                    if (my_interests[i] === name) {
                        $('#info_add_alert').text('Интерес уже добавлен!');
                        return;
                    }
                }
                my_interests.push(name);
                var my_list = $('#user_interests');
                _generateInterest(my_list, name, true);
                $('#add_interest').val('');
                $('#info_add_alert').text('');
            },
            removeInterest: function (index) {
                my_interests.splice(index, 1);
                var to_remove = $('#user_interests .b-interest-list__element')[index];
                to_remove.remove();
            },
            addFriendInterest: function (name, element) {
                for (var i = 0, len = my_interests.length; i < len; i++) {
                    if (my_interests[i] === name) {
                        alert('Интерес уже есть в Вашем списке!');
                        return;
                    }
                }
                my_interests.push(name);
                var my_list = $('#user_interests');
                _generateInterest(my_list, name, true);

                $(element).addClass('added')
                        .find('.b-interest__name').toggleClass('active').end()
                        .find('.b-interest__control').toggle().end()
                        .find('.b-interest__added').toggleClass('b-interest__added_hidden').end()
                        .find('.b-interest__complain').toggleClass('b-interest__complain_hidden').end();
            },
            complainAboutInterest: function (name) {
                $(".b-popup-cover").fadeIn(500);
                $('.b-popup__interest-name').text('"' + name + '"');
            },
            populateMyInterests: function () {
                var my_list = $('#user_interests');
                my_interests.forEach(function (element) {
                    _generateInterest(my_list, element, true);
                });
            },
            populateFriendInterests: function () {
                var my_list = $('#friend_interests');
                friend_interests.forEach(function (element) {
                    _generateInterest(my_list, element, false);
                });
            }
        };
    })();

    $('#add_interest').on('keypress', function (e) {
        if ((e.keyCode || e.which) === 13) {
            InterestActions.addInterest($.trim($(this).val()));
        }
    });
    $(".popup_close").on('click', function () {
        $(".b-popup-cover").fadeOut(500);
    });
    $('#user_interests').on('mouseenter mouseleave', '.b-interest-list__element', function () {
        //This can be done with pure CSS
        $(this).find('.b-interest__control').toggleClass('b-interest__control_del');
    });
    $('#user_interests').on('click', '.b-interest-list__element', function (e) {
        if (e.target.nodeName === 'A') {
            var elementIndex = $(this).index();
            e.preventDefault();
            e.stopPropagation();
            InterestActions.removeInterest(elementIndex);
        }
    });
    $('#friend_interests').on('mouseenter mouseleave', '.b-interest-list__element', function () {
        //This can be done with pure CSS
        if (!$(this).hasClass('added')) {
            $(this).find('.b-interest__control').toggleClass('b-interest__control_add').end()
                    .find('.b-interest__complain').toggleClass('b-interest__complain_hidden').end()
                    .find('.b-interest__name').toggleClass('active');
        }
    });
    $('#friend_interests').on('click', '.b-interest-list__element', function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.target.nodeName === 'A') {
            var interestName = $(this).find('.b-interest__text').text();
            if ($(e.target).hasClass('b-interest__control')) {
                InterestActions.addFriendInterest(interestName, this);
                return;
            }
            InterestActions.complainAboutInterest(interestName);
        }
    });
    InterestActions.populateMyInterests();
    InterestActions.populateFriendInterests();
});
