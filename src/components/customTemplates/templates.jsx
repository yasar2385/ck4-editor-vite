
export const ReportTemplate = (username = "User") => `
  <h2>Monthly Report - ${new Date().toLocaleString("default", { month: "long" })}</h2>
  <p><strong>Prepared by:</strong> ${username}</p>
  <p>
    This report provides an overview of the team's progress, challenges, and next steps.
  </p>
  <ul>
    <li>✅ Project milestones achieved</li>
    <li>📊 Performance metrics</li>
    <li>🧩 Next sprint planning</li>
  </ul>
  <p><em>Generated automatically on ${new Date().toLocaleDateString()}</em></p>
`;


export const ArticleTemplate = (title = "Untitled Article", author = "Guest") => `
  <h1>${title}</h1>
  <p><strong>Author:</strong> ${author}</p>

  <p>
    In today’s fast-paced digital world, staying ahead means constantly evolving 
    and adapting. This article explores the trends shaping modern workflows.
  </p>

  <figure class="image">
    <img src="https://picsum.photos/600/300" alt="Random cover" style="max-width:100%; border-radius:8px;" />
    <figcaption>Illustration for the topic.</figcaption>
  </figure>

  <h3>Key Insights</h3>
  <ol>
    <li>Technology and collaboration go hand-in-hand.</li>
    <li>Automation empowers creative productivity.</li>
    <li>AI tools are redefining content creation.</li>
  </ol>

  <p>Thanks for reading! Don’t forget to leave your comments below.</p>
`;


export const MeetingNotesTemplate = (meetingTitle = "Weekly Sync") => `
  <h2>${meetingTitle}</h2>
  <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
  <p><strong>Attendees:</strong> John, Sarah, Mike, Emma</p>

  <table style="width:100%; border-collapse: collapse;" border="1">
    <thead>
      <tr><th>Topic</th><th>Discussion</th><th>Action Items</th></tr>
    </thead>
    <tbody>
      <tr><td>UI Redesign</td><td>Finalize mockups</td><td>Review next week</td></tr>
      <tr><td>Backend API</td><td>Integrate new endpoints</td><td>Testing phase</td></tr>
      <tr><td>Deployment</td><td>Set up staging environment</td><td>DevOps to assist</td></tr>
    </tbody>
  </table>

  <p><em>Meeting concluded with action item follow-up scheduled for next Monday.</em></p>
`;


export const ProductOverviewTemplate = (product = "New Product") => `
  <h2>${product} Overview</h2>
  <p>
    The <strong>${product}</strong> is designed to deliver efficiency, performance, 
    and seamless user experience across multiple platforms.
  </p>

  <h3>Highlights</h3>
  <ul>
    <li>🚀 High performance and reliability</li>
    <li>⚙️ Modular and scalable architecture</li>
    <li>🎨 Intuitive user interface design</li>
  </ul>

  <figure class="image">
    <img src="https://picsum.photos/400/200" alt="${product}" style="border-radius:8px;" />
    <figcaption>${product} — Example display.</figcaption>
  </figure>

  <p><em>Created on ${new Date().toLocaleDateString()}</em></p>
`;
