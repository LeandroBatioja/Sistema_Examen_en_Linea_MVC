(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', function() {
    enableRadioKeyboardNavigation();
    enableArrowKeyShortcuts();
    enableFormValidationHints();
  });

  function enableRadioKeyboardNavigation() {
    const radioGroups = {};
    document.querySelectorAll('input[type="radio"]').forEach(function(radio) {
      var name = radio.name;
      if (!radioGroups[name]) {
        radioGroups[name] = [];
      }
      radioGroups[name].push(radio);
    });

    Object.keys(radioGroups).forEach(function(name) {
      var radios = radioGroups[name];
      radios.forEach(function(radio, index) {
        radio.addEventListener('keydown', function(e) {
          var targetIndex = -1;
          switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
              e.preventDefault();
              targetIndex = (index + 1) % radios.length;
              break;
            case 'ArrowUp':
            case 'ArrowLeft':
              e.preventDefault();
              targetIndex = (index - 1 + radios.length) % radios.length;
              break;
            case 'Home':
              e.preventDefault();
              targetIndex = 0;
              break;
            case 'End':
              e.preventDefault();
              targetIndex = radios.length - 1;
              break;
          }
          if (targetIndex >= 0) {
            radios[targetIndex].focus();
            radios[targetIndex].checked = true;
          }
        });
      });
    });
  }

  function enableArrowKeyShortcuts() {
    document.addEventListener('keydown', function(e) {
      if (e.altKey) {
        switch (e.key) {
          case 'd':
            e.preventDefault();
            window.location.href = '/dashboard';
            break;
          case 'l':
            e.preventDefault();
            window.location.href = '/login';
            break;
          case 'h':
            e.preventDefault();
            window.location.href = '/';
            break;
        }
      }
    });
  }

  function enableFormValidationHints() {
    var forms = document.querySelectorAll('form');
    forms.forEach(function(form) {
      form.addEventListener('submit', function(e) {
        var invalidFields = form.querySelectorAll(':invalid');
        if (invalidFields.length > 0) {
          e.preventDefault();
          invalidFields[0].focus();
          var errorDiv = document.createElement('div');
          errorDiv.className = 'alert alert-error';
          errorDiv.setAttribute('role', 'alert');
          errorDiv.setAttribute('aria-live', 'assertive');
          errorDiv.innerHTML = '<span class="alert-icon" aria-hidden="true">⚠️</span>' +
            '<span class="alert-text">Error: Por favor complete todos los campos requeridos correctamente</span>';
          var existingError = form.querySelector('.alert-error');
          if (existingError) {
            existingError.remove();
          }
          form.insertBefore(errorDiv, form.firstChild);
          invalidFields[0].focus();
        }
      });

      var inputs = form.querySelectorAll('input');
      inputs.forEach(function(input) {
        input.addEventListener('blur', function() {
          if (input.validity && input.validity.valid === false && input.value !== '') {
            input.setAttribute('aria-invalid', 'true');
            var msg = getErrorMessage(input);
            if (msg && !input.nextElementSibling.classList.contains('field-error')) {
              var errorSpan = document.createElement('span');
              errorSpan.className = 'field-error';
              errorSpan.setAttribute('role', 'alert');
              errorSpan.style.color = '#c0392b';
              errorSpan.style.fontSize = '0.875rem';
              errorSpan.textContent = msg;
              errorSpan.id = input.id + '-error';
              input.parentNode.insertBefore(errorSpan, input.nextSibling);
              input.setAttribute('aria-describedby', input.getAttribute('aria-describedby') + ' ' + input.id + '-error');
            }
          } else {
            input.removeAttribute('aria-invalid');
            var existingError = input.parentNode.querySelector('.field-error');
            if (existingError) {
              existingError.remove();
            }
          }
        });
      });
    });
  }

  function getErrorMessage(input) {
    if (input.validity.valueMissing) {
      return 'Este campo es obligatorio';
    }
    if (input.validity.typeMismatch) {
      if (input.type === 'email') {
        return 'Ingrese un correo electronico valido';
      }
    }
    if (input.validity.tooShort) {
      return 'Este campo debe tener al menos ' + input.minLength + ' caracteres';
    }
    return null;
  }
})();
