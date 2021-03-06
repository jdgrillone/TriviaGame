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
}, {
  question: "What is the Japanese word that means 'empty orchestra'?",
  choices: ["Ohayo", "Karaoke", "Nihon", "Katsudon"],
  correctAnswer: 1
}, {
  question: "What is 'ikebana'?",
  choices: ["the art of flower arrangement", "a term for a sword duel", "a gambling addiction", "ones prowess of eating with sticks as a tool"],
  correctAnswer: 0
},
];

var instructions = "You will be given a series of questions about Japan and it's culture.  You will have 20 seconds to answer each question.  Make your guess and click the 'Next' button to advance to the next question. Good luck!"

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
  	$('#next').hide();
  	$("#show-timer").hide();
  	var comment = $('<p>');
  	comment.text(instructions);
  	$("#quiz").append(comment);
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

  // 'Next' button click handler
  $('#next').on('click', function (e) {
  	e.preventDefault();

    // Suspend click listener during fade animation
    if(quiz.is(':animated')) {        
    	return false;
    }
    choose();
    
    // If no user selection, progress is stopped
    if (isNaN(selections[questionCounter])) {
    	alert('Please make a guess!');
    } else {
    	questionCounter++;
    	displayNext();
    }
  });
  
  
  // 'Start Over' button click handler
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
  
  // Creates and returns a div that contains the question and possible answers
  function createQuestion(index) {
  	var questionDiv = $('<div>', {
  		id: 'question'
  	});

  	var header = $('<h2>Question ' + (index + 1) + ':</h2>');
  	questionDiv.append(header);

  	var question = $('<p>').append(questions[index].question);
  	questionDiv.append(question);

  	var radioButtons = createRadios(index);
  	questionDiv.append(radioButtons);

  	return questionDiv;
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
      //alerts user...I'd like to avoid using an alert for this.
      alert("Time up!");
      //places a wrong answer into selections array
      selections[questionCounter] = 5;
      //advances counter to next question
      questionCounter++;
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
    //displays timer to page
    $("#show-timer").show();
  	//fades out previous question
  	quiz.fadeOut(function() {
      //removes question from div
      $('#question').remove();
      //checks if there are more questions in the array
      if(questionCounter < questions.length){
        //resets and runs timer
        run();
        //sets nextQuestion to the new question
        var nextQuestion = createQuestion(questionCounter);
        //fades in nextQuestion
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

  	score.append('You scored: ' + numCorrect + ' out of ' +
  		questions.length + ' questions.');
  	return score;
  }
