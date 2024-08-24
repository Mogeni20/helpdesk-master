$(document).ready(function () {
  function addLoading(button) {
    button.prop("disabled", true); // Disable the button
    button.data("original-text", button.html()); // Store original text
    button.html(button.html() + ' <span class="loading">Loading...</span>'); // Add loading text
  }

  function removeLoading(button) {
    button.prop("disabled", false); // Re-enable the button
    button.html(button.data("original-text")); // Restore original text
  }

  function submitForm(formId, postData, successCallback) {
    const submitButton = $(formId).find("button[type='submit']");
    addLoading(submitButton);

    $.post("../core/process.php", postData, function (data) {
      successCallback(data);
      removeLoading(submitButton);
    });
  }

  function submitAjaxForm(formId, formData, successCallback) {
    const submitButton = $(formId).find("button[type='submit']");
    addLoading(submitButton);

    $.ajax({
      url: "../core/process.php",
      type: "POST",
      data: formData,
      contentType: false,
      processData: false,
      success: function (data) {
        successCallback(data);
      },
      error: function (xhr, status, error) {
        console.error("An error occurred:", error);
        $("#photoErr").html("An error occurred while uploading the photo.");
      },
      complete: function () {
        removeLoading(submitButton);
      },
    });
  }

  $("#change_email").submit(function (e) {
    e.preventDefault();
    submitForm(
      "#change_email",
      { func: "change_email", email: $("#cemail").val() },
      function (data) {
        $("#mailErr").html(data);
      }
    );
  });

  $("#change_password").submit(function (e) {
    e.preventDefault();
    submitForm(
      "#change_password",
      {
        func: "change_password",
        new: $("#cnew").val(),
        current: $("#ccurrent").val(),
      },
      function (data) {
        $("#pwErr").html('<div class="alert">' + data + "</div>");
      }
    );
  });

  $("#change_nickname").submit(function (e) {
    e.preventDefault();
    submitForm(
      "#change_nickname",
      { func: "change_nickname", nickname: $("#cnickname").val() },
      function (data) {
        $("#nickErr").html(data);
      }
    );
  });

  $("#change_profile_photo").submit(function (e) {
    e.preventDefault();

    var formData = new FormData(this);
    formData.append("func", "change_profile_photo");

    submitAjaxForm("#change_profile_photo", formData, function (data) {
      $("#photoErr").html(data);
    });
  });

  // Preview the image before uploading
  $("#profile-pic-upload").change(function (event) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#preview").attr("src", e.target.result);
    };
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
  });

  $("#change_url").submit(function (e) {
    e.preventDefault();
    submitForm(
      "#change_url",
      { func: "change_url", url: $("#curl").val() },
      function (data) {
        $("#urlErr").html(data);
      }
    );
  });

  $("#remove_url").click(function (e) {
    e.preventDefault();
    $.post("../core/process.php", { func: "remove_url" }, function (data) {
      $("#curl").val("");
      $("#urlErr").html(data);
    });
  });

  $("#reply").submit(function (e) {
    e.preventDefault();
    submitForm(
      "#reply",
      { func: "reply", ticket: $.urlParam("id"), text: $("#rtext").val() },
      function (data) {
        $.post(
          "../core/process.php",
          { func: "replies", ticket: $.urlParam("id") },
          function (data) {
            $("#replies").empty();
            $("#replies").html(data);
            $("#rtext").val("");
          }
        );
      }
    );
  });

  $("#delete_account").submit(function (e) {
    e.preventDefault();
    if (
      confirm(
        "Are you sure you want to deactivate your account? This cannot be undone."
      )
    ) {
      submitForm("#delete_account", { func: "delete_me" }, function () {
        location.reload();
      });
    }
  });

  $("#add_department").submit(function (e) {
    e.preventDefault();
    submitForm(
      "#add_department",
      { func: "add_department", dpt: $("#dpt").val() },
      function () {
        $.post(
          "../core/process.php",
          { func: "all_departments" },
          function (data) {
            $("#all_departments").empty().html(data);
            $("#dpt").val("");
          }
        );
      }
    );
  });

  $("#auth").submit(function (e) {
    e.preventDefault();
    submitForm(
      "#auth",
      {
        func: "auth",
        email: $("#email").val(),
        password: $("#password").val(),
        type:
          document.getElementById("radio1").checked == true
            ? "returning_user"
            : "new_user",
      },
      function (data) {
        let parsedData = data;
        if (parsedData === "success") {
          location.reload();
        } else {
          $("#alerts").html(
            '<div class="alert" style="color: white;">' + parsedData + "</div>"
          );
        }
      }
    );
  });

  $("#create_ticket").submit(function (e) {
    e.preventDefault();
    submitForm(
      "#create_ticket",
      {
        func: "create_ticket",
        subject: $("#subject").val(),
        department: $("#department").val(),
        message: $("#message").val(),
      },
      function (data) {
        let result = data.split(" ");
        if (result[0] === "success") {
          location.href = "/ticket/?id=" + result[1];
        } else {
          $("#create_ticket_error").html(data);
        }
      }
    );
  });

  // Toggle settings based on input elements
  if ($("#allow_self_delete, #allow_signin, #allow_register").length) {
    $.post("../core/process.php", { func: "get_settings" }, function (data) {
      const volgorde = [
        "allow_self_delete",
        "allow_signin",
        "allow_register",
        "enable_protection",
      ];
      const settings = data.split(" ");
      volgorde.forEach((id, index) => {
        $("#" + id).prop("checked", settings[index] == 1);
      });
    });

    $(
      "#allow_self_delete, #allow_signin, #allow_register, #enable_protection"
    ).click(function () {
      const id = $(this).attr("id");
      const status = $(this).is(":checked") ? 1 : 0;
      $.post("../core/process.php", {
        func: "settings",
        functio: id.replace("allow_", ""),
        status: status,
      });
    });
  }

  $("#delete_dpt").click(function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this department?")) {
      $.post(
        "../core/process.php",
        { func: "delete_dpt", department: $.urlParam("department") },
        function (data) {
          if (data === "success") location.href = "site_management.php?success";
        }
      );
    }
  });

  $("#dptform").submit(function (e) {
    e.preventDefault();
    submitForm(
      "#dptform",
      {
        func: "update_dpt",
        department: $.urlParam("department"),
        update: $("#dept_new").val(),
      },
      function (data) {
        $("#dptERR").html(data);
        $("#delete_dpt").html('Delete "' + $("#dept_new").val() + '"');
      }
    );
  });

  $("#admin_update_nickname").click(function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to update this user's details?")) {
      submitForm(
        null,
        {
          func: "admin_update_nickname",
          user: $.urlParam("user"),
          update: $("#nickname").val(),
        },
        function (data) {
          if (data === "success") {
            $("#errors").html(
              '<div class="alert success">The user\'s <b>nickname</b> has been updated successfully.</div>'
            );
          }
        }
      );
    }
  });

  $("#admin_update_email").click(function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to update this user's details?")) {
      submitForm(
        null,
        {
          func: "admin_update_email",
          user: $.urlParam("user"),
          update: $("#email").val(),
        },
        function (data) {
          if (data === "success") {
            $("#errors").html(
              '<div class="alert success">The user\'s <b>email address</b> has been updated successfully.</div>'
            );
          }
        }
      );
    }
  });

  $("#make_admin").click(function (e) {
    e.preventDefault();
    if (confirm("Are you sure you want to make this user an administrator?")) {
      submitForm(
        null,
        { func: "make_admin", user: $.urlParam("user") },
        function (data) {
          if (data === "success") {
            $("#errors").html(
              '<div class="alert success">This user is now an administrator.</div>'
            );
            $("#make_admin").html("User is admin").removeAttr("id");
          }
        }
      );
    }
  });

  $("#change_access").click(function (e) {
    e.preventDefault();
    submitForm(
      null,
      { func: "change_block", user: $.urlParam("user") },
      function () {
        const text =
          $("#change_access").html() === "Access denied"
            ? "Don't allow access"
            : "Access denied";
        $("#change_access").html(text);
      }
    );
  });

  $("#no_longer_help").click(function (e) {
    e.preventDefault();
    submitForm(
      null,
      { func: "no_longer_help", ticket: $.urlParam("id") },
      function (data) {
        if (data === "success") {
          location.reload();
        }
      }
    );
  });

  $("#close_ticket").click(function (e) {
    e.preventDefault();
    submitForm(
      null,
      { func: "close_ticket", ticket: $.urlParam("id") },
      function (data) {
        if (data === "success") {
          location.reload();
        }
      }
    );
  });
});

$.urlParam = function (name) {
  var results = new RegExp("[?&]" + name + "=([^&#]*)").exec(
    window.location.href
  );
  return results ? results[1] : null;
};
