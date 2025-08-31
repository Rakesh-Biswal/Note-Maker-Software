// app/api/cron/process-reminders/route.js
import { getDb } from "@/lib/mongodb"
import { sendEmail, reminderNotificationTemplate } from "@/lib/email"

export async function GET(request) {
  // Verify this is coming from Vercel Cron
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    console.log("⏰ Processing reminders at:", new Date().toISOString());
    const db = await getDb();
    const now = new Date();
    
    // Find notes with reminders that are due (within the last minute)
    const dueReminders = await db.collection("notes").find({
      reminder: {
        $lte: now, 
        $ne: null 
      }
    }).toArray();

    console.log(`📋 Found ${dueReminders.length} due reminders`);

    let processedCount = 0;
    let errorCount = 0;

    for (const note of dueReminders) {
      try {
        // Get user details - try both email and phone matching
        let userQuery = {};
        if (note.email) {
          userQuery.email = note.email;
        } else if (note.phone) {
          userQuery.phone = note.phone;
        } else {
          console.log(`❌ Note ${note._id} has no email or phone, skipping`);
          continue;
        }

        const user = await db.collection("users").findOne(userQuery);

        if (user?.email) {
          console.log(`📧 Sending reminder for note "${note.title}" to ${user.email}`);
          
          // Send reminder email
          await sendEmail({
            to: user.email,
            subject: `⏰ Reminder: ${note.title || "Your Note"}`,
            html: reminderNotificationTemplate({
              name: user.name || "User",
              noteTitle: note.title || "Untitled Note",
              noteId: note.id || note._id?.toString(),
              noteContent: note.content
            })
          });

          // Remove the reminder after sending
          await db.collection("notes").updateOne(
            { _id: note._id },
            { $unset: { reminder: "" } }
          );
          
          console.log(`✅ Reminder sent and removed for note ${note._id}`);
          processedCount++;
        } else {
          console.log(`❌ No user found for note ${note._id}, skipping`);
        }
      } catch (error) {
        console.error(`❌ Failed to process reminder for note ${note._id}:`, error.message);
        errorCount++;
      }
    }

    return Response.json({ 
      success: true,
      processed: processedCount,
      errors: errorCount,
      total: dueReminders.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("💥 Reminder processing error:", error);
    return Response.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}

// Optional: Add a test endpoint to manually trigger
export async function POST(request) {
  try {
    const { secret } = await request.json();
    
    if (secret !== process.env.CRON_SECRET) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Call the GET handler
    return GET(request);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}