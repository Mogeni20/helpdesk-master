<?php
include '../init.php';
include '../core/includes/head.php';
if ($users->signed_in()) {
?>
	<style>
		.profile-upload-container {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			align-items: center;
			margin-top: 20px;
			border: 1px solid #ddd;
			border-radius: 8px;
			padding: 15px;
			background-color: #f9f9f9;
		}

		.upload-label {
			display: block;
			margin-bottom: 10px;
			font-weight: bold;
			color: #333;
			cursor: pointer;
			font-size: 14px;
		}

		.upload-input {
			display: none;
		}

		.profile-preview {
			margin-top: 10px;
			width: 80px;
			height: 80px;
			border-radius: 8px;
			border: 1px solid #ddd;
		}

		.error-message {
			color: red;
			margin-top: 10px;
		}
	</style>
	<div class="container">
		<div class="row">
			<div class="four columns settings-profile">
				<a href="../"><span class="entypo-left-open"></span>Dashboard</a>
				<div class="three columns">
					<img src="<?= $users->getuserinfo('profile_photo') ?>" height="100px" width="100px">
				</div>
				<ul>
					<li><b>
							<h4><?php echo $users->getuserinfo('nick_name'); ?></h4>
						</b></li>
					<li>Registered <?php echo $time->ago($users->getuserinfo('sign_up_date')); ?></li>
					<li>Last login <?php echo $time->ago($users->getuserinfo('last_login')); ?></li>
					<br>
					<li><b><?php echo $tickets->my_tickets_info('open'); ?></b> Open Tickets</li>
					<li><b><?php echo $tickets->my_tickets_info('resolved'); ?></b> Resolved Tickets</li>
					<li><b><?php echo $tickets->my_tickets_info('unanswered'); ?></b> Unanswered Tickets</li>
				</ul>
			</div>

			<div class="eight columns settings-forms">
				<div id="emailButton" class="accordionButton">Email Address</div>
				<div class="accordionContent">
					<div id="mailErr"></div>
					<form id="change_email">
						<input class="u-full-width" autocomplete="off" id="cemail" type="email" placeholder="me@domain.com" value="<?php echo $users->getuserinfo('email') ?>">
						<button type="submit" name="submit_email">Update Email Address</button>
					</form>
				</div>

				<div id="passwordButton" class="accordionButton">Password</div>
				<div class="accordionContent">
					<div id="pwErr"></div>
					<form id="change_password">
						<input class="u-full-width" id="cnew" type="password" placeholder="New Password">
						<input class="u-full-width" id="ccurrent" type="password" placeholder="Confirm Current Password">
						<button type="submit" name="submit_password">Update Password</button>
					</form>
				</div>

				<div id="nicknameButton" class="accordionButton">Nickname</div>
				<div class="accordionContent">
					<div id="nickErr"></div>
					<form id="change_nickname">
						<input class="u-full-width" id="cnickname" type="text" autocomplete="off" placeholder="Nickname" value="<?php echo $users->getuserinfo('nick_name') ?>">
						<button type="submit">Update Nickname</button>
					</form>
				</div>

				<div id="urlButton" class="accordionButton">Website URL</div>
				<div class="accordionContent">
					<div id="urlErr"></div>
					<form id="change_url">
						<input class="u-full-width" type="text" id="curl" autocomplete="off" placeholder="http://" value="<?php echo $users->getuserinfo('url') ?>">
						<button type="submit">Update Website URL</button>
						<button id="remove_url">Remove</button>
					</form>
				</div>

				<div class="accordionButton">Profile Picture</div>
				<div class="accordionContent">
					<div id="photoErr" class="error-message"></div>
					<div class="profile-upload-container">
						<div>
							<label for="profile-pic-upload" class="upload-label">
								<i class="fas fa-upload"></i> Upload Profile Picture
							</label>
							<form action="profile-photo" method="POST" enctype="multipart/form-data" id="change_profile_photo">
								<input type="file" id="profile-pic-upload" name="profile_picture" class="upload-input" accept="image/*">
								<div>
									<button type="submit">Update</button>
								</div>
							</form>

						</div>
						<img id="preview" class="profile-preview" src="<?= $users->getuserinfo('profile_photo') ?>" alt="Profile Picture Preview" style="object-fit: cover;">
					</div>
				</div>


				<?php if ($admin->site_settings('self_delete_account') == 1) { ?>

					<div class="accordionButton">Deactivating Account!</div>
					<div class="accordionContent">
						<p style="color:#e55">Please confirm that you wish to deactivate your account and lose all your data.</p>
						<form method="post" id="delete_account">
							<button type="submit">Deactivate my account</button>
						</form>
					</div>
				<?php } ?>
			</div>
		</div>
	</div>

<?php
} else {
	header('Location: ../authenticate');
	die();
}
include '../core/includes/foot.php';
?>