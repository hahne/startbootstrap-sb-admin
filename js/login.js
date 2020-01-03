$(document).ready(function() { 
    var options = { 
        target:        '#loginDialogDIV'
	 
        
    }; 
 
    
    $('#loginDialog').submit(function() { 
        $(this).ajaxSubmit(options);
	    return false; 
    }); 
}); 