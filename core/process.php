<?php
include '../init.php';

if ($users->signed_in()) {
    switch ($_POST['func']) {
        case 'change_email':
            $users->change_email($_POST['email']);
            break;
        case 'change_password':
            $users->change_password($_POST['new'], $_POST['current']);
            break;
        case 'change_nickname':
            $users->change_nickname($_POST['nickname']);
            break;
        case 'change_profile_photo':
            if (isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === UPLOAD_ERR_OK) {
                $fileTmpPath = $_FILES['profile_picture']['tmp_name'];
                $fileName = $_FILES['profile_picture']['name'];
                $fileSize = $_FILES['profile_picture']['size'];
                $fileType = $_FILES['profile_picture']['type'];
                $fileNameCmps = explode(".", $fileName);
                $fileExtension = strtolower(end($fileNameCmps));

                // Specify allowed file extensions and max file size (in bytes)
                $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif'];
                $maxFileSize = 5 * 1024 * 1024; // 5MB

                if (in_array($fileExtension, $allowedExtensions) && $fileSize <= $maxFileSize) {
                    // Define the upload path
                    $uploadFileDir = '../uploads/';
                    $dest_path = $uploadFileDir . $fileName;

                    // Move the file to the destination path
                    if (move_uploaded_file($fileTmpPath, $dest_path)) {
                        // Update user's profile photo path in the database
                        $users->update_profile_photo($dest_path);
                    } else {
                        echo '<div class="alert error">There was an error moving the uploaded file.</div>';
                    }
                } else {
                    echo '<div class="alert error">Invalid file extension or file size exceeds the limit.</div>';
                }
            } else {
                echo '<div class="alert error">No file uploaded or there was an upload error.</div>';
            }
            break;
        case 'change_url':
            $users->change_url($_POST['url']);
            break;
        case 'remove_url':
            $users->remove_url();
            break;
        case 'reply':
            $tickets->reply($_COOKIE['user'], $_POST['ticket'], $_POST['text']);
            break;
        case 'replies':
            $tickets->ticket_replies($_POST['ticket']);
            break;
        case 'delete_me':
            $users->delete_me();
            break;
        case 'add_department':
            $admin->create_department($_POST['dpt']);
            break;
        case 'all_departments':
            echo $admin->all_departments();
            break;
        case 'create_ticket':
            $tickets->create($_POST['subject'], $_POST['department'], $_POST['message']);
            break;
        case 'get_settings':
            $admin->get_settings();
            break;
        case 'delete_dpt':
            $admin->delete_department($_POST['department']);
            break;
        case 'update_dpt':
            $admin->update_department($_POST['department'], $_POST['update']);
            break;
        case 'admin_update_nickname':
            $admin->update_nickname($_POST['user'], $_POST['update']);
            break;
        case 'admin_update_email':
            $admin->update_email($_POST['user'], $_POST['update']);
            break;
        case 'make_admin':
            $admin->make_admin($_POST['user'], $_COOKIE['user']);
            break;
        case 'change_block':
            $admin->change_block($_POST['user']);
            break;
        case 'settings':
            $admin->settings($_POST['functio'], $_POST['status']);
            break;
        case 'no_longer_help':
            $tickets->ticket_resolved($_POST['ticket']);
            break;
        case 'close_ticket':
            $admin->close_ticket($_POST['ticket']);
            break;
    }
} else {
    if ($_POST['func'] == 'auth') {
        $users->auth($_POST['email'], $_POST['password'], $_POST['type']);
    }
}
