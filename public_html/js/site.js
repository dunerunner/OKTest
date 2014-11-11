var my_interests = ['Хоккей', 'Высокоточная вёрстка под старые версии Microsoft Internet Explorer, начиная с версии 5.01'];
var friend_interests = ['Баскетбол', 'Нарезка Photoshop/Fireworks макетов на скорость, в экстремальных условиях, на природе'];

$(document).ready(function () {
    function addInterest(name) {
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
        generateInterest(my_list, name, my_interests.length - 1, true);
        $('#add_interest').val('');
        $('#info_add_alert').text('');
    }
    function removeInterest(name) {
        my_interests.forEach(function (element, index) {
            if (element === name) {
                my_interests.splice(index, 1);
                var to_remove = $('#user_interests li')[index];
                to_remove.remove();
                return;
            }
        });
    }
    function addFriendInterest(name, element) {
        for (var i = 0, len = my_interests.length; i < len; i++) {
            if (my_interests[i] === name) {
                alert('Интерес уже есть в Вашем списке!');
                return;
            }
        }
        my_interests.push(name);
        var my_list = $('#user_interests');
        generateInterest(my_list, name, my_interests.length - 1, true);

        element.unbind('mouseenter mouseleave');

        element.find('.b-interest__name').toggleClass('active');
        element.find('.b-interest__control').toggle();
        element.find('.b-interest__added').toggleClass('b-interest__added_hidden');
        element.find('.b-interest__complain').toggleClass('b-interest__complain_hidden');
    }
    function generateInterest(list, name, index, isMine) {
        var li = $('<li class="b-interest-list__element"/>').appendTo(list);
        var interest = $('<div class="b-interest"/>')
                .appendTo(li);
        var action_control = $('<a class="b-interest__control"/>')
                .attr('href', '')
                .appendTo(interest);
        if (!isMine) {
            var complaint_control = $('<a class="b-interest__complain b-interest__complain_hidden" />')
                    .attr('href', '')
                    .text('пожаловаться')
                    .appendTo(interest);
        }
        var interest_name = $('<div class="b-interest__name"/>')
                .appendTo(interest);
        var interest_text = $('<div class="b-interest__text"/>')
                .text(name)
                .appendTo(interest_name);
        var text_fader = $('<div class="b-interest__fader"/>')
                .addClass('info_fader')
                .appendTo(interest_name);
        if (isMine) {
            action_control.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                removeInterest(name);
            });
            li.on('mouseenter mouseleave', function () {
                action_control.toggleClass('b-interest__control_del');
            });
        } else {
            var added_info = $('<div class="b-interest__added b-interest__added_hidden"/>')
                    .text('добавлено в ваши увлечения')
                    .appendTo(interest_name);
            action_control.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                addFriendInterest(name, li);
            });
            complaint_control.on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                $(".b-popup-cover").fadeIn(500);
                $('.b-popup__interest-name').text('"' + friend_interests[index] + '"');
            });
            li.on('mouseenter mouseleave', function () {
                action_control.toggleClass('b-interest__control_add');
                complaint_control.toggleClass('b-interest__complain_hidden');
                interest_name.toggleClass('active');
            });
        }
    }
    function generateMyInterestList() {
        var my_list = $('#user_interests');
        my_interests.forEach(function (element, index) {
            generateInterest(my_list, element, index, true);
        });
    }
    function generateFriendInterestList() {
        var my_list = $('#friend_interests');
        friend_interests.forEach(function (element, index) {
            generateInterest(my_list, element, index, false);
        });
    }

    var interest_input = $('#add_interest');
    interest_input.on('keypress', function (e) {
        if ((e.keyCode || e.which) === 13) {
            addInterest($.trim(interest_input.val()));
        }
    });

    generateMyInterestList();
    generateFriendInterestList();

    $(".popup_close").on('click', function () {
        $(".b-popup-cover").fadeOut(500);
    });
});
