/**
 * Multiple Choice Question
 */
H5P.MultiChoice = (function ($, Question) {
  
  /**
   * Constructor for the MultiChoice class
   *
   * @param {Object} params
   * @param {number} contentId
   * @param {Object} settings
   * @returns {Object}
   */
  function MultiChoice(params, contentId, settings) {
    // Initialize the parent class
    Question.call(this, params, contentId, settings);
    
    // Set defaults
    this.params.singleAnswer = this.params.singleAnswer || false;
    this.params.answers = this.params.answers || [];
    this.params.behaviour = this.params.behaviour || {};
    this.params.behaviour.enableRetry = this.params.behaviour.enableRetry || false;
    this.params.behaviour.enableSolutionsButton = this.params.behaviour.enableSolutionsButton || true;
    this.params.behaviour.multipleDrag = this.params.behaviour.multipleDrag || false;
    
    // Initialize variables
    this.selectedAnswers = [];
    this.answered = false;
  }

  // Inherit from Question
  MultiChoice.prototype = Object.create(Question.prototype);
  MultiChoice.prototype.constructor = MultiChoice;

  /**
   * Attach the multiple choice question to the given container.
   */
  MultiChoice.prototype.attach = function ($container) {
    var self = this;
    
    // Call parent attach method
    Question.prototype.attach.call(this, $container);
    
    // Create options container
    this.$optionsContainer = $('<div class="h5p-multichoice-options">');
    this.$content.append(this.$optionsContainer);
    
    // Add answer options
    for (var i = 0; i < this.params.answers.length; i++) {
      var answer = this.params.answers[i];
      var $option = this.createOption(answer, i);
      this.$optionsContainer.append($option);
    }
    
    // Update settings
    this.params.tryAgain = this.params.behaviour.enableRetry;
  };

  /**
   * Create a single option element.
   *
   * @param {Object} answer
   * @param {number} index
   * @returns {H5P.jQuery}
   */
  MultiChoice.prototype.createOption = function (answer, index) {
    var self = this;
    var $option = $('<div class="h5p-multiple-choice-option" data-index="' + index + '">');
    
    // Add input element
    var inputType = this.params.singleAnswer ? 'radio' : 'checkbox';
    var inputName = this.params.singleAnswer ? 'mc-answer-' + this.contentId : 'mc-answer-' + this.contentId + '[]';
    
    var $input = $('<input type="' + inputType + '" name="' + inputName + '" value="' + index + '">');
    $option.append($input);
    
    // Add text
    $option.append($('<span>' + answer.text + '</span>'));
    
    // Add event listener
    $option.on('click', function () {
      if (self.params.singleAnswer) {
        // For single answer, unselect all others
        self.$optionsContainer.find('.h5p-multiple-choice-option').removeClass('selected');
        self.selectedAnswers = [];
      }
      
      var optionIndex = parseInt($(this).data('index'));
      var isSelected = $(this).hasClass('selected');
      
      if (isSelected) {
        // Deselect
        $(this).removeClass('selected');
        var idx = self.selectedAnswers.indexOf(optionIndex);
        if (idx > -1) {
          self.selectedAnswers.splice(idx, 1);
        }
      } else {
        // Select
        $(this).addClass('selected');
        if (!self.params.singleAnswer || self.selectedAnswers.length === 0) {
          self.selectedAnswers.push(optionIndex);
        }
      }
      
      self.answered = self.selectedAnswers.length > 0;
    });
    
    return $option;
  };

  /**
   * Determine if the user's answer is correct.
   *
   * @returns {boolean}
   */
  MultiChoice.prototype.isAnswerCorrect = function () {
    if (this.selectedAnswers.length === 0) {
      return false;
    }
    
    // Find correct answers
    var correctAnswers = [];
    for (var i = 0; i < this.params.answers.length; i++) {
      if (this.params.answers[i].correct) {
        correctAnswers.push(i);
      }
    }
    
    // Check if selected answers match correct answers
    if (this.selectedAnswers.length !== correctAnswers.length) {
      return false;
    }
    
    for (var j = 0; j < this.selectedAnswers.length; j++) {
      if (correctAnswers.indexOf(this.selectedAnswers[j]) === -1) {
        return false;
      }
    }
    
    return true;
  };

  /**
   * Reset the task to its initial state.
   */
  MultiChoice.prototype.resetTask = function () {
    // Call parent reset
    Question.prototype.resetTask.call(this);
    
    // Reset options
    this.$optionsContainer.find('.h5p-multiple-choice-option').removeClass('selected');
    this.selectedAnswers = [];
    this.answered = false;
  };

  /**
   * Show the solution.
   */
  MultiChoice.prototype.showSolutions = function () {
    // Highlight correct answers
    for (var i = 0; i < this.params.answers.length; i++) {
      var answer = this.params.answers[i];
      var $option = this.$optionsContainer.find('[data-index="' + i + '"]');
      
      if (answer.correct) {
        $option.addClass('correct');
      } else if (this.selectedAnswers.indexOf(i) !== -1) {
        $option.addClass('incorrect');
      }
    }
  };

  /**
   * Get xAPI data.
   *
   * @returns {object}
   */
  MultiChoice.prototype.getXAPIData = function () {
    var xAPIEvent = this.createXAPIEventTemplate('interacted');
    return {
      event: xAPIEvent,
      statement: xAPIEvent.getVerifiedStatement()
    };
 };

  return MultiChoice;
})(H5P.jQuery, H5P.Question);