/**
 * jspsych-single-stim
 * Josh de Leeuw
 *
 * plugin for displaying a stimulus and getting a keyboard response
 *
 * documentation: docs.jspsych.org
 *
 **/


	jsPsych.plugins["letter-matching"] = (function() {

		var plugin = {};

		plugin.trial = function(display_element, trial) {

			// parameters
			// trial.item, trial.prev_item, trial.prev_two_item should all be letters defined in the trial definition.
			trial.square_size = trial.square_size || 300;
			trial.timing_duration = trial.timing_duration || 1000;
			trial.prompt = trial.prompt || "";

			// if any trial variables are functions
			// this evaluates the function and replaces
			// it with the output of the function
			trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

			// size calcs
			var inner_window = trial.square_size - (trial.square_size / 6);
			var border_size = trial.square_size / 12;
			var letter_size = trial.square_size / 2;
			var top_letter = inner_window/2 - letter_size/2;

			// display stimulus
			display_element.html(
			'<div id="jspsych-letter-matching-container" style="position: relative; margin:auto; height: '+trial.square_size+'px; width:'+(2*(inner_window+letter_size)+trial.square_size-border_size)+'px;overflow:hidden;">'+
			'<div id="jspsych-letter-matching-left" style="position: absolute; top:'+border_size+'px;left:0px;width:'+inner_window+'px; height: '+inner_window+'px;">'+
				'<div id="jspsych-letter-matching-stim-left" style="font-family: \'Roboto Mono\'; font-size:'+letter_size+'px; width:'+letter_size+'px;height:'+letter_size+'px; line-height: '+letter_size+'px; text-align:center; position:absolute; top:'+top_letter+'px; left: '+inner_window+'px;"><span>'+trial.prev_two_item+'</span></div>'+
			'</div>'+
			'<div id="jspsych-letter-matching-middle" style="position: absolute; top:'+border_size+'px;left:'+(inner_window+letter_size)+'px;width:'+inner_window+'px; height: '+inner_window+'px;">'+
				'<div id="jspsych-letter-matching-stim-middle" style="font-family: \'Roboto Mono\'; font-size:'+letter_size+'px; width:'+letter_size+'px;height:'+letter_size+'px; line-height: '+letter_size+'px; text-align:center; position:absolute; top:'+top_letter+'px; left: '+inner_window+'px;"><span>'+trial.prev_item+'</span></div>'+
			'</div>'+
			'<div id="jspsych-letter-matching-right" style="position: absolute;top:0px;left:'+(2*(inner_window+letter_size)-border_size)+'px; width:'+trial.square_size+'px; height:'+trial.square_size+'px;">'+
        '<div id="jspsych-letter-matching-inner" style="width:'+inner_window+'px; height: '+inner_window+'px; position: relative; border: solid #ddd '+border_size+'px; background-color: #ddd;">'+
          '<div id="jspsych-letter-matching-stim-right" style="font-family: \'Roboto Mono\'; font-size:'+letter_size+'px; width:'+letter_size+'px;height:'+letter_size+'px; line-height: '+letter_size+'px; text-align:center; position:absolute; top:'+top_letter+'px; left: '+inner_window+'px;"><span>'+trial.item+'</span></div>'+
        '</div>'+
      '</div>'+
			'</div>');

			//show prompt if there is one
			if (trial.prompt !== "") {
				display_element.append(trial.prompt);
			}

			// store response
			var response = {rt: -1, key: -1, correct: false};

			// function to end trial when it is time
			var end_trial = function() {

				// kill keyboard listeners
				if(typeof keyboardListener !== 'undefined'){
					jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
				}

				// gather the data to store for the trial
				var trial_data = {
					"rt": response.rt,
					"stimulus": trial.item,
					"key_press": response.key,
					"correct": response.correct
				};

				// clear the display
				display_element.html('');

				// move on to the next trial
				jsPsych.finishTrial(trial_data);
			};

			// function to handle responses by the subject
			var after_response = function(info) {

				var correct = (info.key == jsPsych.pluginAPI.convertKeyCharacterToKeyCode(trial.item));
				var color = correct ? '#0f0' : '#f00';

				$('#jspsych-letter-matching-inner').css('border-color',color);
				$('#jspsych-letter-matching-inner').css('background-color', color);

				response.key = info.key;
				response.rt = info.rt;
				response.correct = correct;

			};

			// start the response listener
			var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
				callback_function:after_response,
				valid_responses:[],
				allow_held_key: false
			});

			// animate the letter
			$('#jspsych-letter-matching-stim-left').animate({left:-letter_size+"px"},trial.timing_duration,"linear");
			$('#jspsych-letter-matching-stim-middle').animate({left:-letter_size+"px"},trial.timing_duration,"linear");
			$('#jspsych-letter-matching-stim-right').animate({left:-letter_size+"px"},trial.timing_duration,"linear");

			// end trial if time limit is set
			setTimeout(function() {
					end_trial();
			}, trial.timing_duration);

		};

		return plugin;
	})();
