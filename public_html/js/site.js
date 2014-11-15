var my_interests = ['Хоккей', 'Высокоточная вёрстка под старые версии Microsoft Internet Explorer, начиная с версии 5.01'];
var friend_interests = ['Баскетбол', 'Нарезка Photoshop/Fireworks макетов на скорость, в экстремальных условиях, на природе'];

$(document).ready(function () {
    var config = {
        userInterestBlock: '#user_interests',
        friendInterestBlock: '#friend_interests',
        addInterestControl: '#add_interest',
        addAlertElement: '#info_add_alert',
        interestListElement: '.b-interest-list__element'
    };
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
                    $(config.addAlertElement).text('Поле ввода пустое!');
                    return;
                }
                for (var i = 0, len = my_interests.length; i < len; i++) {
                    if (my_interests[i] === name) {
                        $(config.addAlertElement).text('Интерес уже добавлен!');
                        return;
                    }
                }
                my_interests.push(name);
                var my_list = $(config.userInterestBlock);
                _generateInterest(my_list, name, true);
                $(config.addInterestControl).val('');
                $(config.addAlertElement).text('');
            },
            removeInterest: function (index) {
                my_interests.splice(index, 1);
                var to_remove = $(config.userInterestBlock + ' ' + config.interestListElement)[index];
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
                var my_list = $(config.userInterestBlock);
                _generateInterest(my_list, name, true);

                $(element).addClass('added')
                        .find('.b-interest__name').toggleClass('active').end()
                        .find('.b-interest__control').toggle().end()
                        .find('.b-interest__added').toggleClass('b-interest__added_hidden').end()
                        .find('.b-interest__complain').toggleClass('b-interest__complain_hidden').end();
            },
            complainAboutInterest: function (name) {
                $('.b-popup__interest-name').text('"' + name + '"');
                $(".b-popup-cover").fadeIn(500);
            },
            populateInterests: function (interestsArr, list, isOwn) {
                if (!list.length) {
                    console.error('Empty list element!');
                    return;
                }
                var frag = document.createDocumentFragment();
                interestsArr.forEach(function (element) {
                    _generateInterest(frag, element, isOwn);
                });
                list[0].appendChild(frag);
            }
        };
    })();

    $(config.addInterestControl).on('keypress', function (e) {
        if ((e.keyCode || e.which) === 13) {
            InterestActions.addInterest($.trim($(this).val()));
        }
    });
    $(".popup_close").on('click', function () {
        $(".b-popup-cover").fadeOut(500);
    });

    $(config.userInterestBlock).on('mouseenter mouseleave', config.interestListElement, function () {
        //This can be done with pure CSS
        $(this).find('.b-interest__control').toggleClass('b-interest__control_del');
    });
    $(config.userInterestBlock).on('click', config.interestListElement, function (e) {
        if (e.target.nodeName === 'A') {
            var elementIndex = $(this).index();
            e.preventDefault();
            e.stopPropagation();
            InterestActions.removeInterest(elementIndex);
        }
    });
    $(config.friendInterestBlock).on('mouseenter mouseleave', config.interestListElement, function () {
        //This can be done with pure CSS
        if (!$(this).hasClass('added')) {
            $(this).find('.b-interest__control').toggleClass('b-interest__control_add').end()
                    .find('.b-interest__complain').toggleClass('b-interest__complain_hidden').end()
                    .find('.b-interest__name').toggleClass('active');
        }
    });
    $(config.friendInterestBlock).on('click', config.interestListElement, function (e) {
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
    InterestActions.populateInterests(my_interests, $(config.userInterestBlock), true);
    InterestActions.populateInterests(friend_interests, $(config.friendInterestBlock), false);
});
