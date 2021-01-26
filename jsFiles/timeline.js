// Define Stimuli

var exp = (function() {

    var p = {};

    // randomly assign to conditions
    var settings = {
        tileOrder: jsPsych.randomization.sampleWithReplacement([1, 0], 1),
        colorOrder: jsPsych.randomization.sampleWithReplacement([1, 0], 1),
        miOrder: jsPsych.randomization.sampleWithoutReplacement([0, 1, 2, 3], 1),
        pM: jsPsych.randomization.sampleWithoutReplacement([2, 3, 4, 5, 6, 7, 8], 2),
        pEM: jsPsych.randomization.sampleWithoutReplacement([6, 7, 8, 9, 10], 2),
    };

    // create text variables for instructions
    var text = {
        game1: settings.colorOrder == 1 ? 'Green Game' : 'Blue Game',
        color1: settings.colorOrder == 1 ? 'green' : 'blue',
        hex1: settings.colorOrder == 1 ? '#00aa00' : '#1067e8',
        span1: settings.colorOrder == 1 ? 'a-span' : 'b-span',
        bestOdds1: `${ settings.pEM[0]*10 }%`,
        worstOdds1:  `${ (10-settings.pEM[0])*10 }%`,
        game2: settings.colorOrder == 0 ? 'Green Game' : 'Blue Game',
        color2: settings.colorOrder == 0 ? 'green' : 'blue',
        hex2: settings.colorOrder == 0 ? '#00aa00' : '#1067e8',
        span2: settings.colorOrder == 0 ? 'a-span' : 'b-span',
        bestOdds2: `${ settings.pEM[1]*10 }%`,
        worstOdds2:  `${ (10-settings.pEM[1])*10 }%`,
        speedChange1: settings.pM[0] < settings.pM[1] ? 'more' : 'less',
        speedChange2: settings.pM[0] < settings.pM[1] ? "you won't have to respond as fast" : "you'll have to respond faster"
    };

    var stim = {
        r1: {
            m1: settings.tileOrder == 1 ? `<img src='img/jackpot.png' class='rewardimg'>` : `<div class="box" style="background-color:${text.hex1}"> </div>`,
            m0: settings.tileOrder == 1 ? `<img src='img/nope.png' class='rewardimg'>` : `<div class="box" style="background-color:white"> </div>`,
            e1: settings.tileOrder == 0 ? `<img src='img/jackpot.png' class='rewardimg'>` : `<div class="box" style="background-color:${text.hex1}"> </div>`,
            e0: settings.tileOrder == 0 ? `<img src='img/nope.png' class='rewardimg'>` : `<div class="box" style="background-color:white"> </div>`
        },
        r2: {
            m1: settings.tileOrder == 1 ? `<img src='img/jackpot.png' class='rewardimg'>` : `<div class="box" style="background-color:${text.hex2}"> </div>`,
            m0: settings.tileOrder == 1 ? `<img src='img/nope.png' class='rewardimg'>` : `<div class="box" style="background-color:white"> </div>`,
            e1: settings.tileOrder == 0 ? `<img src='img/jackpot.png' class='rewardimg'>` : `<div class="box" style="background-color:${text.hex2}"> </div>`,
            e0: settings.tileOrder == 0 ? `<img src='img/nope.png' class='rewardimg'>` : `<div class="box" style="background-color:white"> </div>`          
        }
    }

    // save condition and URL data
    jsPsych.data.addProperties({
        pM: settings.pM,
        pEM: settings.pEM,
        tileOrder: settings.tileOrder,
        colorOrder: settings.colorOrder,
        miOrder: settings.miOrder,
        startDate: jsPsych.data.getURLVariable('date'),
        startTime: jsPsych.data.getURLVariable('time'),
    });

   /*
    *
    *   INSTRUCTIONS
    *
    */

    p.intro = {}

    // temporary data
    var compAns1,
        compAns2,
        pages = {
            r1: {
                part1: [`<div class='parent' style='text-align: left'>
                <p>We are designing games that can be used by behavioral scientists to study motivation and decision making. 
                To make the games as engaging as possible, we are getting feedback from people like you.</p>
                <p>You will play two different games: the <span class='${text.span1}'>${text.game1}</span> and the 
                <span class='${text.span2}'>${text.game2}</span>. Then you will tell us which you found more engaging.</p>
                <p>The games are very similar, but their color schemes will help you tell them apart.</p>
                <p>Continue to learn about and play the <span class='${text.span1}'>${text.game1}</span>.</p>
                <p>After you finish, you will learn about and play the <span class='${text.span2}'>${text.game2}</span>.</p>
                </div>`],

                part2: [`<div class='parent'>
                <p>The goal of the <span class='${text.span1}'>${text.game1}</span> is to win as many "10-cent Jackpots" as possible.</p>
                <p>For every 10-cent Jackpot you win, you will receive an extra 10 cents; at the end of the study, 
                you will receive $7 for your participation, plus an additional 10 cents for each 10-cent Jackpot you win.</p>
                </div>`,

                `<div class='parent'>
                <p>To win 10-cent Jackpots, you will try to "activate" tiles like this one:</p>
                <div class="box" style="background-color:gray"></div>
                </div>`,

                `<div class='parent'>
                <p>The tiles will appear and disappear very quickly. To activate a tile, you must press your SPACE BAR 
                before it disappears; whenever you see a tile, you should press your SPACE BAR as fast as possible.</p>
                <div class="box" style="background-color:gray"></div>
                </div>`,

                `<div class='parent'>
                <p>In the <span class='${text.span1}'>${text.game1}</span>, tiles turn <span class='${text.span1}'>${text.color1}</span> 
                if activated.</p>
                <div class='box' style='background-color:${text.hex1}'></div>
                </div>`,

                `<div class='parent'>
                <p>If you turn a tile <span class='${text.span1}'>${text.color1}</span>, your odds of winning a 10-cent 
                Jackpot that trial are <span class='${text.span1}'>${text.bestOdds1}</span>.</p>
                <div class='box' style='background-color:${text.hex1}'></div>
                </div>`,

                `<div class='parent'>
                <p>If a tile disappears before you turn it <span class='${text.span1}'>${text.color1}</span>,
                your odds of winning a 10-cent Jackpot that trial are <span class='${text.span1}'>${text.worstOdds1}</span>.</p>
                </div>`,

                `<div class='parent'>
                <p>If you win a 10-cent Jackpot, you'll see this image...</p>
                <img src='img/jackpot.png', style='height: 75%'>
                </div>`,

                `<div class='parent'>
                <p>...and if you don't win a 10-cent Jackpot, you'll see this image.</p>
                <img src='img/nope.png', style='height: 75%'>
                </div>`],

                part3: [`<div class='parent'>
                <p>You are now ready to play the <span class='${text.span1}'>${text.game1}</span>.</p>
                <p>Once you proceed, the <span class='${text.span1}'>${text.game1}</span> will start immediately, 
                so get ready to press your SPACEBAR.</p>
                <p>Continue to the next screen to begin.</p>
                </div>`]
            },
            r2: {
                part1: [`<div class='parent'>
                <p>Thank you for playing the <span class='${text.span1}'>${text.game1}</span>!</p>
                When you're ready, continue to learn about and play the <span class='${text.span2}'>${text.game2}</span>.</p>
                </div>`],

                part2: [`<div class='parent'>
                <p>The <span class='${text.span2}'>${text.game2}</span> is identical to the 
                <span class='${text.span1}'>${text.game1}</span> with three exceptions.</p>
                </div>`,

                `<div class='parent'>
                <p>First, in the <span class='${text.span2}'>${text.game2}</span>, tiles turn 
                <span class='${text.span2}'>${text.color2}</span> if activated.</p>
                <div class='box' style='background-color:${text.hex2}'></div>
                </div>`,

                `<div class='parent'>
                <p>Second, in the <span class='${text.span2}'>${text.game2}</span>, if you turn a tile 
                <span class='${text.span2}'>${text.color2}</span>, your odds of winning a 10-cent Jackpot that trial 
                are <span class='${text.span2}'>${text.bestOdds2}</span> (instead of <span class='${text.span1}'>${text.bestOdds1}</span>)...</p>
                <div class='box' style='background-color:${text.hex2}'></div>
                </div>`,

                `<div class='parent'>
                <p>...and if a tile disappears before you turn it <span class='${text.span2}'>${text.color2}</span>,
                <br>your odds of winning a 10-cent Jackpot that trial are <span class='${text.span2}'>${text.worstOdds2}</span>
                (instead of <span class='${text.span1}'>${text.worstOdds1}</span>).</p>
                </div>`,

                `<div class='parent'>
                <p>Finally, in the <span class='${text.span2}'>${text.game2}</span>, you'll have ${text.speedChange1} time 
                to activate the tiles.<br>Thus, in the <span class='${text.span2}'>${text.game2}</span>, ${text.speedChange2}.</p>
                <div class='box' style='background-color:${text.hex2}'></div>
                </div>`],

                part3: [`<div class='parent'>
                <p>You are now ready to play the <span class='${text.span2}'>${text.game2}</span>.</p>
                <p>Once you proceed, the <span class='${text.span2}'>${text.game2}</span> will start immediately, 
                so get ready to press your SPACEBAR.</p>
                <p>Continue to the next screen to begin.</p>
                </div>`]
            }
        };

    // constructor function for comprehension check loop
    function MakeLoop(span, game, color, round) {

        var percentScale = ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"];

        var errorMessage = {
            type: "instructions",
            pages: [`<div class='parent'>
            <p>You provided the wrong answer.<br>To make sure you understand how to play, 
            please continue to re-read the instructions.</p>
            </div>`],
            show_clickable_nav: true,
        };

        var info = {
            type: "instructions",
            pages: round == 'R1' ? pages.r1.part2 : pages.r2.part2,
            show_clickable_nav: true,
        };

        var compChk1 = {
            type: 'survey-likert',
            preamble: `<div style="font-size:16px">
            <p>To make sure you understand the rules of the <span class='${span}'>${game}</span>,
            please answer the following question.</p></div>`,
            questions: [
                {prompt: `If you turn a tile <span class='${span}'>${color}</span>, 
                what are your chances of winning a 10-cent Jackpot on that trial?`,
                name: `percentChk1_${round}`,
                labels: percentScale}
            ],
            scale_width: 500,
            on_finish: function(data){
                compAns1 = JSON.parse(data.responses)[`percentChk1_${round}`]
            }
        };

        var compChk2 = {
            type: 'survey-likert',
            preamble: `<div style="font-size:16px">
            <p>To make sure you understand the rules of the <span class='${span}'>${game}</span>,
            please answer the following question.</p></div>`,
            questions: [
                {prompt: `If the tile disappears before you turn it <span class='${span}'>${color}</span>, 
                what are your chances of winning a 10-cent Jackpot on that trial?`,
                name: `percentChk2_${round}`,
                labels: percentScale}
            ],
            scale_width: 500,
            on_finish: function(data){
                compAns2 = JSON.parse(data.responses)[`percentChk2_${round}`]
            },
        };

        var conditionalNode = {
            timeline: [errorMessage],
            conditional_function: function() {
                var i = (round == 'R1') ? 0 : 1;
                return (compAns1 == settings.pEM[i] && compAns2 == (10-settings.pEM[i])) ? false : true;
            }
        };

        this.timeline = [info, compChk1, compChk2, conditionalNode];
        this.loop_function = function(){
            var i = (round == 'R1') ? 0 : 1;
            return (compAns1 == settings.pEM[i] && compAns2 == (10-settings.pEM[i])) ? false : true;
        };
    };

    // create instruction variables
    p.intro.r1part1 = {
        type: "instructions",
        pages: pages.r1.part1,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.intro.r2part1 = {
        type: "instructions",
        pages: pages.r2.part1,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.intro.r1part2 = new MakeLoop(text.span1, text.game1, text.color1, 'R1');

    p.intro.r2part2 = new MakeLoop(text.span2, text.game2, text.color2, 'R2');

    p.intro.r1part3 = {
        type: "instructions",
        pages: pages.r1.part3,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

    p.intro.r2part3 = {
        type: "instructions",
        pages: pages.r2.part3,
        show_clickable_nav: true,
        post_trial_gap: 500,
    };

   /*
    *
    *   TASK
    *
    */

    p.task = {}

    // constructor functions
    function MakeHitFeedback() {
        var e1r1 = Array(settings.pEM[0]).fill(stim.r1.e1);
        var e0r1 = Array(10-settings.pEM[0]).fill(stim.r1.e0);
        var e1r2 = Array(settings.pEM[1]).fill(stim.r2.e1);
        var e0r2 = Array(10-settings.pEM[1]).fill(stim.r2.e0);
        this.R1 = jsPsych.randomization.shuffle(e1r1.concat(e0r1));
        this.R2 = jsPsych.randomization.shuffle(e1r2.concat(e0r2));
    };

    function MakeMissFeedback() {
        var e1r1 = Array(10-settings.pEM[0]).fill(stim.r1.e1);
        var e0r1 = Array(settings.pEM[0]).fill(stim.r1.e0);
        var e1r2 = Array(10-settings.pEM[1]).fill(stim.r2.e1);
        var e0r2 = Array(settings.pEM[1]).fill(stim.r2.e0);
        this.R1 = jsPsych.randomization.shuffle(e1r1.concat(e0r1));
        this.R2 = jsPsych.randomization.shuffle(e1r2.concat(e0r2));
    };

    function MakeLatencyArrays() {
        var fastR1 = Array(settings.pM[0]).fill(225);
        var slowR1 = Array(10-settings.pM[0]).fill(750);
        var fastR2 = Array(settings.pM[1]).fill(225);
        var slowR2 = Array(10-settings.pM[1]).fill(750);
        this.R1 = jsPsych.randomization.shuffle(fastR1.concat(slowR1));
        this.R2 = jsPsych.randomization.shuffle(fastR2.concat(slowR2));
    };

    function MakeProbe(round) {
        this.type = 'html-keyboard-response';
        this.data = {Trial_Type: 'probe'};
        this.stimulus = '<div class="box" style="background-color:gray"></div>';
        this.choices = [32];
        this.trial_duration = function(){ return latency[round][tNum-1] };
        this.on_finish = function(data){
            data.key_press == 32 ? data.TooSlow = 0 : data.TooSlow = 1;
        };
    };

    function MakeResponse(round) {
        this.type = 'html-keyboard-response';
        this.data = {Trial_Type: `activation${round}`};
        this.stimulus = function(){
            if (jsPsych.data.get().last(1).values()[0].key_press == 32) {
                return (round == 'R1') ? stim.r1.m1 : stim.r2.m1
            } else {
                return (round == 'R1') ? stim.r1.m0 : stim.r2.m0
            }
        };
        this.choices = [32];
        this.response_ends_trial = false;
        this.trial_duration = 1000;
        this.on_finish = function(){
            jsPsych.data.get().last(2).values()[0].key_press != 32 ? misses++ : hits++;
        };      
    };

    function MakeFeedback(round) {
        this.type = 'html-keyboard-response';
        this.data = {Trial_Type: `feedback${round}`};
        this.stimulus = function(){
            return (jsPsych.data.get().last(2).values()[0].key_press == 32) ? hitFeedback[round][hits-1] : missFeedback[round][misses-1];
        };
        this.on_finish = function(data){
            if (tNum == 10) {
                tNum = 0;
                latency = new MakeLatencyArrays();
            };
            if (misses == 10) { 
                misses = 0;
                missFeedback = new MakeMissFeedback();
            };
            if (hits == 10) {
                hits = 0;
                hitFeedback = new MakeHitFeedback();
            };
            data.stimulus == "<img src='img/jackpot.png' class='rewardimg'>" ? data.Jackpot = true : data.Jackpot = false;
            console.log(tNum, hits, misses, missFeedback[round], stim.r1)
        };
        this.choices = jsPsych.NO_KEYS;
        this.trial_duration = 1500;
    };

    // temporary data
    var hitFeedback = new MakeHitFeedback(),
        missFeedback = new MakeMissFeedback(),
        latency = new MakeLatencyArrays(),
        ITI = [250, 500, 750, 1000, 1250, 1500, 1750, 2000, 2250, 2500, 2750, 3000],
        hits = 0,
        misses = 0,
        tNum = 0

    // trial variables
    var probeR1 = new MakeProbe('R1'),
        probeR2 = new MakeProbe('R2'),
        responseR1 = new MakeResponse('R1'),
        responseR2 = new MakeResponse('R2'),
        feedbackR1 = new MakeFeedback('R1'),
        feedbackR2 = new MakeFeedback('R2')

    var delay = {
        type: 'html-keyboard-response',
        data: {Trial_Type: 'ITI'},
        stimulus: "",
        choices: [32],
        trial_duration: function(){
            return jsPsych.randomization.sampleWithoutReplacement(ITI, 1)[0];
        },
        on_finish: function(data){
            tNum++;
            data.key_press == 32 ? data.TooFast = 1 : data.TooFast = 0;
        },
    };

    var tooFast = {
        type: 'html-keyboard-response',
        data: {Trial_Type: 'tooFastMessage'},
        choices: jsPsych.NO_KEYS,
        stimulus: function(){
            var message = `<div style='font-size: 20px'><p>Too Fast!</p><p>Please wait for the tile to appear 
            before pressing your SPACEBAR</p></div>`;
            return (jsPsych.data.get().last(1).values()[0].key_press == 32) ? message : '';
        },
        trial_duration: function(){
            return (jsPsych.data.get().last(1).values()[0].key_press == 32) ? 2500 : 0;
        },
        post_trial_gap: function(){
            return (jsPsych.data.get().last(1).values()[0].key_press == 32) ? 1000 : 0;
        },
    };

    p.task.round1 = {
        timeline: [delay, tooFast, probeR1, responseR1, feedbackR1],
        repetitions: 50,
    };

    p.task.round2 = {
        timeline: [delay, tooFast, probeR2, responseR2, feedbackR2],
        repetitions: 50,
    };

   /*
    *
    *   QUESTIONS
    *
    */

    p.Qs = {};

    // scales
    var zeroToExtremely = ['0<br>Not<br>at all', '1', '2', '3', '4', '5', '6', '7', '8<br>Extremely'];
    var zeroToALot = ['0<br>Not<br>at all', '1', '2', '3', '4', '5', '6', '7', '8<br>A lot'];

    // constructor functions
    var flowQs = function(span, name, round) {
        this.type = 'survey-likert';
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px'>

        <p>Thank you for playing the <span class='${span}'>${name}</span>!</strong></p>

        <p>While playing the <span class='${span}'>${name}</span>, to what extent did you feel immersed 
        an engaged in what you were doing? Report how immersed and engaged you felt by 
        answering the following questions.</p></div>`;
        this.questions = [
            {prompt: `During the <span class='${span}'>${name}</span>, to what extent did you feel absorbed in what you were doing?`,
            name: `absorbed_${round}`,
            labels: zeroToExtremely},
            {prompt: `During <span class='${span}'>${name}</span>, to what extent did you feel immersed in what you were doing?`,
            name: `immersed_${round}`,
            labels: zeroToExtremely},
            {prompt: `During <span class='${span}'>${name}</span>, to what extent did you feel engaged in what you were doing?`,
            name: `engaged_${round}`,
            labels: zeroToExtremely},
            {prompt: `During <span class='${span}'>${name}</span>, to what extent did you feel engrossed in what you were doing?`,
            name: `engrossed_${round}`,
            labels: zeroToExtremely},
        ];
        this.randomize_question_order = false;
        this.scale_width = 500;
    };

    var enjoyQs = function(span, name, round) {
        this.type = 'survey-likert';
        this.preamble = `<div style='padding-top: 50px; width: 850px; font-size:16px'>

        <p>Below are a few more questions about the <span class='${span}'>${name}</span>. Instead of asking about flow, 
        these questions ask about <strong>enjoyment</strong>. Report how much you <strong>enjoyed</strong> 
        playing the <span class='${span}'>${name}</span><br>by answering the following questions.</p></div>`;
        this.questions = [
            {prompt: `How much did you enjoy playing the <span class='${span}'>${name}</span>?`,
            name: `enjoyable_${round}`,
            labels: zeroToALot},
            {prompt: `How much did you like playing the <span class='${span}'>${name}</span>?`,
            name: `like_${round}`,
            labels: zeroToALot},
            {prompt: `How much did you dislike playing the <span class='${span}'>${name}</span>?`,
            name: `dislike_${round}`,
            labels: zeroToALot},
            {prompt: `How much fun did you have playing the <span class='${span}'>${name}</span>?`,
            name: `fun_${round}`,
            labels: zeroToALot},
            {prompt: `How entertaining was the <span class='${span}'>${name}</span>?`,
            name: `entertaining_${round}`,
            labels: zeroToExtremely},
        ];
        this.randomize_question_order = false;
        this.scale_width = 500;
    };

    p.Qs.round1 = {
        timeline: [new flowQs(text.span1, text.game1, 'R1'), new enjoyQs(text.span1, text.game1, 'R1')]
    };

    p.Qs.round2 = {
        timeline: [new flowQs(text.span2, text.game2, 'R2'), new enjoyQs(text.span2, text.game2, 'R2')]
    };

    p.Qs.demographics = (function() {
        var gender = {
            type: 'html-button-response',
            stimulus: '<p>Gender:</p>',
            choices: ['Male', 'Female', 'Other'],
        };
        var age = {
            type: 'survey-text',
            questions: [{prompt: "Age:", name: "age"}],
        }; 
        var ethnicity = {
            type: 'html-button-response',
            stimulus: '<p>Ethnicity:</p>',
            choices: ['White / Caucasian', 'Black / African American','Asian / Pacific Islander', 'Hispanic', 'Native American', 'Other'],
        };
        var english = {
            type: 'html-button-response',
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
        };  
        var finalWord = {
            type: 'survey-text',
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
        }; 
        var email = {
            type: 'survey-text',
            questions: [{prompt: "", placeholder: "Prolific ID", name: "PID", columns: 50, required: true}],
            button_label: ['CLICK HERE TO FINISH'], 
        };
        var demos = {
            timeline: [gender, age, ethnicity, english, finalWord, email]
        };

        return demos;
    }());


    return p;

}());

var timeline = [
    exp.intro.r1part1,
    exp.intro.r1part2,
    exp.intro.r1part3,
    exp.task.round1,
    exp.Qs.round1,
    exp.intro.r2part1,
    exp.intro.r2part2,
    exp.intro.r2part3,
    exp.task.round2,
    exp.Qs.round2,
    exp.Qs.demographics
];

jsPsych.init({
    timeline: timeline, 
    // on_finish: function() {
    //     firebase.database().ref(firebase.auth().currentUser.uid).set({
    //         data: jsPsych.data.get().values()
    //     })
    // }
});