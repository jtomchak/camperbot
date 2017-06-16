/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's conversation system.

In this example, Botkit hears a keyword, then asks a question. Different paths
through the conversation are chosen based on the user's response.

*/

module.exports = function (controller) {

    // controller.hears(['time'], 'direct_message,direct_mention', function(bot, message) {

    //     bot.startConversation(message, function(err, convo) {
    //         convo.say('This is an example of using convo.ask with a single callback.');

    //         convo.ask('What is your favorite color?', function(response, convo) {

    //             convo.say('Cool, I like ' + response.text + ' too!');
    //             convo.next();

    //         });
    //     });

    // });


    controller.hears(['time'], 'direct_message,direct_mention', function (bot, message) {

        let now = new Date.now();
        let nowTime = `:${now.getMinutes()}`;
        if (now.getHours() > 12) {
            nowTime = now.getHours() - 12 + nowTime;
        } else {
            nowTime = now.getHours() + nowTime;
        };

        bot.createConversation(message, function (err, convo) {

            // create a path for when a user says YES
            convo.addMessage({
                text: `It is ${nowTime} in Phoenix.`,
            }, 'yes_thread');

            // create a path for when a user says NO
            // mark the conversation as unsuccessful at the end
            convo.addMessage({
                text: 'Good luck spending your tie wisely.',
                action: 'stop', // this marks the converation as unsuccessful
            }, 'no_thread');

            // create a path where neither option was matched
            // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
            convo.addMessage({
                text: 'Sorry I did not understand. Try `yes` or `no`',
                action: 'default',
            }, 'bad_response');

            // Create a yes/no question in the default thread...
            convo.ask('Do you want to know the time in Phoenix, AZ?', [{
                    pattern: bot.utterances.yes,
                    callback: function (response, convo) {
                        convo.gotoThread('yes_thread');
                    },
                },
                {
                    pattern: bot.utterances.no,
                    callback: function (response, convo) {
                        convo.gotoThread('no_thread');
                    },
                },
                {
                    default: true,
                    callback: function (response, convo) {
                        convo.gotoThread('bad_response');
                    },
                }
            ]);

            convo.activate();

            // capture the results of the conversation and see what happened...
            convo.on('end', function (convo) {

                if (convo.successful()) {
                    // this still works to send individual replies...
                    bot.reply(message, 'Have a good day!');

                    // and now deliver cheese via tcp/ip...
                }

            });
        });

    });

};