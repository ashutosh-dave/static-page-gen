# Static Page Generator (PHP + Handlebars)

A minimal static site generator built for generating **location-based landing pages** using a common HTML/CSS/JS layout. Outputs `.php` files that are ready to upload to a PHP server (e.g., Plesk-hosted site).

---

## 🚀 Features

- ⚡ CLI-based content injection using JSON
- 🎯 Reusable Handlebars template for consistent layout
- 🧠 Designed for SEO-optimized, lead-generation landing pages
- 🛠 Outputs `.php` files (not static `.html`)
- 🔍 Manual control for final review and SEO optimization

---

## 📁 Project Structure

```
static-page-gen/
├── content/          # JSON files for each location
│   └── london.json
├── template/         # Handlebars layout file
│   └── base.hbs
├── build/            # Generated .php files
├── generate.js       # Node.js script to generate pages
├── .gitignore
└── README.md
```

---

## 🧰 Requirements

- [Node.js](https://nodejs.org/) v14 or later
- Basic terminal knowledge

---

## 🛠 Usage

### 1. Install dependencies

```bash
npm install
```

### 2. Add your content

Create a JSON file in `content/` for each location:

`content/london.json`

```json
{
  "page_title": "Offices in London - Flexible Workspaces",
  "meta_description": "Discover private and serviced office spaces in London with flexible leases.",
  "headline": "Workspaces Tailored for London",
  "city": "London",
  "cta_link": "/contact-us.php",
  "cta_text": "Book a Free Tour",
  "form_action": "/submit-form.php",
  "form_button_text": "Send Enquiry"
}
```

### 3. Generate the PHP file

```bash
node generate.js content/london.json
```

This creates:

```
build/london.php
```

### 4. Upload to Server

After manual SEO review, upload the `.php` file and assets to your server (e.g., via FTP or Plesk panel).

---

## 🧩 Template Fields

These are examples of fields used in `base.hbs`:

- `page_title`
- `meta_description`
- `headline`
- `city`
- `cta_link`
- `cta_text`
- `form_action`
- `form_button_text`

Feel free to expand with custom fields (e.g., testimonials, pricing, location-specific services).

---

## 🙋‍♂️ Why Not a CMS?

This project is intentionally **lean** and **developer-first**:
- No admin panel
- No bloat
- No dynamic server-side processing

It’s ideal for when **you** (the developer) want control and speed — especially when creating 50–100+ landing pages.

---

## 📦 Future Ideas

- [ ] Sitemap generator
- [ ] JSON schema validator
- [ ] FTP deployment script
- [ ] GitHub Actions for preview builds
- [ ] Support for partials (header/footer)

---

## 👨‍💻 Author

**Ashutosh Dave**  
[github.com/ashutosh-dave](https://github.com/ashutosh-dave)

---

## 📝 License

MIT License — use freely, modify aggressively.
