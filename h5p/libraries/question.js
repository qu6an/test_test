/**
 * Question base class
 */
H5P.Question = (function ($) {
  
  /**
   * Constructor for the Question class
   *
   * @param {Object} params
   * @param {number} contentId
   * @param {Object} settings
   * @returns {Object}
   */
  function Question(params, contentId, settings) {
    this.params = params;
    this.contentId = contentId;
    this.settings = settings;
    
    // Set defaults
    this.params.question = this.params.question || '';
    this.params.correctFeedback = this.params.correctFeedback || 'Correct!';
    this.params.incorrectFeedback = this.params.incorrectFeedback || 'Incorrect. Please try again.';
    this.params.tryAgain = this.params.tryAgain || false;
    
    // Initialize variables
    this.hasAnswered = false;
    this.userInput = null;
    this.score = 0;
    this.maxScore = 1;
  }

  /**
   * Attach the question to the given container.
   */
  Question.prototype.attach = function ($container) {
    var self = this;
    
    // Create wrapper
    this.$container = $container;
    this.$wrapper = $('<div class="h5p-question">');
    $container.append(this.$wrapper);
    
    // Add question text
    this.$question = $('<div class="h5p-question-text">' + this.params.question + '</div>');
    this.$wrapper.append(this.$question);
    
    // Add content area for child implementations
    this.$content = $('<div class="h5p-question-content">');
    this.$wrapper.append(this.$content);
    
    // Add feedback area
    this.$feedback = $('<div class="h5p-question-feedback h5p-hidden">');
    this.$wrapper.append(this.$feedback);
    
    // Add buttons container
    this.$buttons = $('<div class="h5p-question-buttons">');
    this.$wrapper.append(this.$buttons);
    
    // Add check button
    this.$checkButton = $('<button class="h5p-question-check-button">Check</button>');
    this.$buttons.append(this.$checkButton);
    this.$checkButton.on('click', function () {
      self.checkAnswer();
    });
    
    // Add retry button (initially hidden)
    this.$retryButton = $('<button class="h5p-question-retry-button h5p-hidden">Retry</button>');
    this.$buttons.append(this.$retryButton);
    this.$retryButton.on('click', function () {
      self.resetTask();
    });
    
    // Add show solution button (initially hidden)
    this.$solutionButton = $('<button class="h5p-question-solution-button h5p-hidden">Show Solution</button>');
    this.$buttons.append(this.$solutionButton);
    this.$solutionButton.on('click', function () {
      self.showSolutions();
    });
    
    // Add result container
    this.$result = $('<div class="h5p-question-result h5p-hidden">');
    this.$wrapper.append(this.$result);
    
    // Set initial state
    this.resetTask();
  };

  /**
   * Check the user's answer.
   */
  Question.prototype.checkAnswer = function () {
    if (!this.hasAnswered) {
      return;
    }
    
    var correct = this.isAnswerCorrect();
    this.score = correct ? this.maxScore : 0;
    
    // Show feedback
    this.$feedback.html(correct ? this.params.correctFeedback : this.params.incorrectFeedback);
    this.$feedback.removeClass('h5p-hidden');
    this.$feedback.addClass(correct ? 'h5p-question-correct' : 'h5p-question-incorrect');
    
    // Update button visibility
    this.$checkButton.addClass('h5p-hidden');
    this.$retryButton.toggleClass('h5p-hidden', !this.params.tryAgain);
    this.$solutionButton.removeClass('h5p-hidden');
    
    // Trigger xAPI event
    this.triggerXAPI(correct ? 'completed' : 'failed');
    
    // Update result display
    this.updateResult();
  };

  /**
   * Determine if the user's answer is correct.
   * This should be overridden by child classes.
   *
   * @returns {boolean}
   */
  Question.prototype.isAnswerCorrect = function () {
    return false;
  };

 /**
   * Reset the task to its initial state.
   */
  Question.prototype.resetTask = function () {
    this.hasAnswered = false;
    this.score = 0;
    
    // Hide feedback
    this.$feedback.addClass('h5p-hidden');
    this.$feedback.removeClass('h5p-question-correct h5p-question-incorrect');
    
    // Show check button, hide others
    this.$checkButton.removeClass('h5p-hidden');
    this.$retryButton.addClass('h5p-hidden');
    this.$solutionButton.addClass('h5p-hidden');
    
    // Hide result
    this.$result.addClass('h5p-hidden');
    
    // Reset content specific to child implementations
    this.resetSpecificTask();
  };

  /**
   * Reset content specific to child implementations.
   * This should be overridden by child classes.
   */
  Question.prototype.resetSpecificTask = function () {
    // To be implemented by child classes
  };

  /**
   * Show the solution.
   * This should be overridden by child classes.
   */
  Question.prototype.showSolutions = function () {
    // To be implemented by child classes
  };

  /**
   * Get the current user input.
   *
   * @returns {mixed}
   */
  Question.prototype.getUserInput = function () {
    return this.userInput;
  };

  /**
   * Set the user input.
   *
   * @param {mixed} input
   */
  Question.prototype.setUserInput = function (input) {
    this.userInput = input;
    this.hasAnswered = true;
  };

  /**
   * Get the score for this question.
   *
   * @returns {number}
   */
  Question.prototype.getScore = function () {
    return this.score;
  };

  /**
   * Get the max score for this question.
   *
   * @returns {number}
   */
  Question.prototype.getMaxScore = function () {
    return this.maxScore;
  };

  /**
   * Update the result display.
   */
  Question.prototype.updateResult = function () {
    var scoreText = 'Score: ' + this.score + '/' + this.maxScore;
    this.$result.html(scoreText);
    this.$result.removeClass('h5p-hidden');
  };

  /**
   * Trigger an xAPI event.
   *
   * @param {string} verb
   */
  Question.prototype.triggerXAPI = function (verb) {
    var event = this.createXAPIEventTemplate(verb);
    this.trigger(event);
  };

  /**
   * Create a template for xAPI events.
   *
   * @param {string} verb
   * @returns {H5P.Event}
   */
  Question.prototype.createXAPIEventTemplate = function (verb) {
    var event = new H5P.Event(verb, {
      interactionType: 'compound',
      description: this.params.question
    });
    
    return event;
  };

  /**
   * Get the title of this question.
   *
   * @returns {string}
   */
  Question.prototype.getTitle = function () {
    return H5P.createTitle((this.params.question || {}).question || 'Question');
  };

  return Question;
})(H5P.jQuery);