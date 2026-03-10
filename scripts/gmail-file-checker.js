/**
 * Google Apps Script — Gmail File Checker for Drum Session Studio
 *
 * Deploy as Web App under the info@tonimateos.com Google Workspace account.
 *
 * Setup:
 * 1. Go to script.google.com (logged in as info@tonimateos.com)
 * 2. Create new project → paste this code
 * 3. Project Settings → Script Properties → add CHECKER_SECRET with a random string
 * 4. Deploy → New deployment → Web app → Execute as "Me" → Access "Anyone"
 * 5. Copy the web app URL
 * 6. Set Supabase secrets:
 *    supabase secrets set GMAIL_CHECKER_URL="<web-app-url>"
 *    supabase secrets set GMAIL_CHECKER_SECRET="<same-secret>"
 */

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // Validate shared secret
  var expectedSecret = PropertiesService.getScriptProperties().getProperty("CHECKER_SECRET");
  if (!expectedSecret || data.secret !== expectedSecret) {
    return ContentService.createTextOutput(JSON.stringify({ error: "Unauthorized" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var results = [];
  var checks = data.checks || [];

  for (var i = 0; i < checks.length; i++) {
    var check = checks[i];
    var found = false;
    var method = null;
    var detectedAt = null;
    var messageSubject = null;

    if (!check.emails || check.emails.length === 0) {
      results.push({ orderId: check.orderId, filesReceived: false });
      continue;
    }

    // Build Gmail search queries
    var dateStr = check.afterDate.replace(/-/g, "/");

    // Query 1: emails directly FROM the client
    var emailQuery = check.emails.map(function(email) { return "from:" + email; }).join(" OR ");
    var query1 = "(" + emailQuery + ") after:" + dateStr + " to:info@tonimateos.com";

    // Query 2: WeTransfer/Dropbox/SwissTransfer notifications that mention the client's email in body
    var transferQuery = check.emails.map(function(email) {
      return "(from:wetransfer.com " + email + ") OR (from:dropbox.com " + email + ") OR (from:swisstransfer.com " + email + ")";
    }).join(" OR ");
    var query2 = "(" + transferQuery + ") after:" + dateStr + " to:info@tonimateos.com";

    try {
      var threads = GmailApp.search(query1, 0, 20);
      // Also search for transfer service notifications
      var transferThreads = GmailApp.search(query2, 0, 20);
      for (var tt = 0; tt < transferThreads.length; tt++) {
        threads.push(transferThreads[tt]);
      }

      for (var t = 0; t < threads.length && !found; t++) {
        var messages = threads[t].getMessages();
        for (var m = 0; m < messages.length && !found; m++) {
          var msg = messages[m];

          // Check for attachments (ignore small images likely from signatures)
          var attachments = msg.getAttachments();
          var hasRealAttachment = false;
          for (var a = 0; a < attachments.length; a++) {
            var att = attachments[a];
            var contentType = att.getContentType() || "";
            var size = att.getSize();
            // Skip small images (likely signature images)
            if (contentType.indexOf("image/") === 0 && size < 100000) {
              continue;
            }
            hasRealAttachment = true;
            break;
          }

          if (hasRealAttachment) {
            found = true;
            method = "attachment";
            detectedAt = msg.getDate().toISOString();
            messageSubject = msg.getSubject();
            break;
          }

          // Check body for file sharing links
          var body = msg.getPlainBody().toLowerCase();
          if (body.indexOf("wetransfer.com") !== -1) {
            found = true;
            method = "wetransfer_link";
          } else if (body.indexOf("swisstransfer.com") !== -1) {
            found = true;
            method = "swisstransfer_link";
          } else if (body.indexOf("drive.google.com") !== -1) {
            found = true;
            method = "drive_link";
          } else if (body.indexOf("dropbox.com") !== -1) {
            found = true;
            method = "dropbox_link";
          }

          if (found) {
            detectedAt = msg.getDate().toISOString();
            messageSubject = msg.getSubject();
          }
        }
      }
    } catch (err) {
      Logger.log("Error searching for order " + check.orderId + ": " + err.message);
    }

    results.push({
      orderId: check.orderId,
      filesReceived: found,
      method: method,
      detectedAt: detectedAt,
      messageSubject: messageSubject
    });
  }

  return ContentService.createTextOutput(JSON.stringify({ results: results }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run manually from Apps Script editor to verify Gmail access
 */
function testSearch() {
  var threads = GmailApp.search("to:info@tonimateos.com", 0, 5);
  Logger.log("Found " + threads.length + " threads");
  for (var i = 0; i < threads.length; i++) {
    var msg = threads[i].getMessages()[0];
    Logger.log("From: " + msg.getFrom() + " | Subject: " + msg.getSubject() + " | Attachments: " + msg.getAttachments().length);
  }
}
