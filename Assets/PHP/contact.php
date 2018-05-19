<?php
$field_name = $_POST['cf_name'];
$field_email = $_POST['cf_email'];
$field_num = $_POST['cf_num'];
$field_topic = $_POST['cf_topic'];
$field_message = $_POST['cf_message'];

$mail_to = 'tech2.prpackaging@gmail.com';
$subject = 'Message from a site visitor '.$field_name;

$body_message = 'From: '.$field_name."\n";
$body_message .= 'E-mail: '.$field_email."\n";
$body_message .= 'Number: '.$field_num."\n";
$body_message .= 'Topic: '.$field_topic."\n";
$body_message .= 'Message: '.$field_message;

$headers = 'From: '.$field_email."\r\n";
$headers .= 'Reply-To: '.$field_email."\r\n";

$mail_status = mail($mail_to, $subject, $body_message, $headers);

if ($mail_status) { ?>
	<script language="javascript" type="text/javascript">
		alert('Thank you for the message. We will contact you shortly.');
		window.location = 'contact_page.html';
	</script>
<?php
}
else { ?>
	<script language="javascript" type="text/javascript">
		alert('Message failed. Please, send an email to gordon@template-help.com');
		window.location = 'contact_page.html';
	</script>
<?php
}
?>
