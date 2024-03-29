Stripe.setPublishableKey('pk_test_xQi2TPW1RwyCyj85n7wZhEzN00I7LeBKvc');

// Grab the form:
const $form = $('#checkout-form');


$form.submit(event => {
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        number: $('#card-number').val(),
        cvc: $('#card-cvc').val(),
        exp_month: $('#card-expiry-month').val(),
        exp_year: $('#card-expiry-year').val(),
        name: $('#card-name').val()
      }, stripeResponseHandler);
      return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) { // Problem!
      // Show the errors on the form
      $('#charge-error').text(response.error.message);
      $('#charge-error').removeClass('hidden');
      $form.find('button').prop("disabled", false ); // Re-enable submission
    } else { // Token was created!
      // Get the token ID:
      const token = response.id;

      // Insert the token into the form so it gets submitted to the server:
      $form.append($('<input type="hidden" name="stripeToken" />').val(token));
  
      // Submit the form:
      $form.get(0).submit();
  
    }
  }


// limit input using the mounth, year, cart number
  function limit(element, max_chars)
{
    if(element.value.length > max_chars) {
        element.value = element.value.substr(0, max_chars);
    }
}
function minmax(value, min, max) 
{
    if(parseInt(value) < min || isNaN(parseInt(value))) 
        return 0; 
    else if(parseInt(value) > max) 
        return 100; 
    else return value;
}