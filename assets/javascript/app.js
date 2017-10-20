//Game Object Holding all info for questions
var questions = [{
	question: "What is the capital of Japan?",
	choices: ["Nagoya", "Kyoto", "Osaka", "Tokyo"],
	correctAnswer: 3
}, {
	question: "What is the main island of Japan called?",
	choices: ["Kyushu", "Honshu", "Kanto", "Hiroshima"],
	correctAnswer: 1
}, {
	question: "What is 'Sarutobi'?",
	choices: ["a ninja", "a tea ceremony", "an ornate headress", "a monkey"],
	correctAnswer: 3
}, {
	question: "What is the indigenous faith of Japan?",
	choices: ["Hinduism", "Buddhism", "Shinto", "Sikhism"],
	correctAnswer: 2
}, {
	question: "What is the name of the train that runs fastest in Japan?",
	choices: ["Shinkansen", "Yamanotesen", "Inokashirasen", "JR Sen"],
	correctAnswer: 0
}
];

var questionCounter = 0;
var selections = [];
//Variable to hold the game space reference
var quiz = $('#quiz');
//timer
var numberTimer = 21;
//variable that will hold our interval ID
var intervalID;
// to help prevent timer from stacking
var isRunning = false;

  // Display initial question
  function gameStart() {
  	$('#start').hide();
  	var startButton = $('<button>');
  	startButton.addClass("game-start");
  	startButton.text("Game Start");
  	$("#quiz").append(startButton);
  	$(".game-start").on("click", function() {
  		$("#quiz").empty();
  		displayNext();
  		$('#next').show();
  	});
  }

  gameStart();

  // Click handler for the 'next' button
  $('#next').on('click', function (e) {
  	e.preventDefault();

    // Suspend click listener during fade animation
    if(quiz.is(':animated')) {        
    	return false;
    }
    choose();
    
    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
    	alert('Please make a selection!');
    } else {
    	questionCounter++;
    	displayNext();
    }
});
  
  
  // Click handler for the 'Start Over' button
  $('#start').on('click', function (e) {
  	e.preventDefault();

  	if(quiz.is(':animated')) {
  		return false;
  	}
  	questionCounter = 0;
  	selections = [];
  	$("#quiz").empty();
  	stop();
  	gameStart();
  	
  });
  
  // Creates and returns the div that contains the questions and 
  // the answer selections
  function createQuestion(index) {
  	var qElement = $('<div>', {
  		id: 'question'
  	});

  	var header = $('<h2>Question ' + (index + 1) + ':</h2>');
  	qElement.append(header);

  	var question = $('<p>').append(questions[index].question);
  	qElement.append(question);

  	var radioButtons = createRadios(index);
  	qElement.append(radioButtons);

  	return qElement;
  }
  //function to run when new question is displayed, set to interval every 1s
  function run() {
  	numberTimer = 21;
  	if (isRunning === false){
  		isRunning = true;
  		intervalID = setInterval(decrement, 1000);
  	}
  }

  //The stop function
  function stop() {
  	clearInterval(intervalID);
  	isRunning = false;
  }

  //decrement function
  function decrement() {
  	//decrease timer by one
  	numberTimer--

  	// show timer on screen
  	$("#show-timer").html("<h2>Time: " + numberTimer + "</h2>");

  	if (numberTimer === 0) {
  		alert("Time up!");
  		displayNext();
  	}
  }

  // Creates a list of the answer choices as radio inputs
  function createRadios(index) {
  	var radioList = $('<ul>');
  	var item;
  	var input = '';
  	for (var i = 0; i < questions[index].choices.length; i++) {
  		item = $('<li>');
  		input = '<input type="radio" name="answer" value=' + i + ' />';
  		input += questions[index].choices[i];
  		item.append(input);
  		radioList.append(item);
  	}
  	return radioList;
  }
  
  // Reads the user selection and pushes the value to an array
  function choose() {
  	selections[questionCounter] = +$('input[name="answer"]:checked').val();
  }
  
  // Displays next requested element
  function displayNext() {
  	
  	quiz.fadeOut(function() {
  		$('#question').remove();

  		if(questionCounter < questions.length){
  			run();
  			var nextQuestion = createQuestion(questionCounter);
  			quiz.append(nextQuestion).fadeIn();
  			if (!(isNaN(selections[questionCounter]))) {
  				$('input[value='+selections[questionCounter]+']').prop('checked', true);
  			}

  		}else {
  			var scoreElem = displayScore();
  			quiz.append(scoreElem).fadeIn();
  			$('#next').hide();
  			$('#start').show();
  		}
  	});
  }
  
  // Computes score and returns a paragraph element to be displayed
  function displayScore() {
  	stop();
  	var score = $('<p>',{id: 'question'});

  	var numCorrect = 0;
  	for (var i = 0; i < selections.length; i++) {
  		if (selections[i] === questions[i].correctAnswer) {
  			numCorrect++;
  		}
  	}

  	score.append('You got ' + numCorrect + ' questions out of ' +
  		questions.length + ' right!');
  	return score;
  }
