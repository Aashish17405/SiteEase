<p align="center">
    <img src="https://res.cloudinary.com/djlgmbop9/image/upload/v1735040353/final_okxcef.png" align="center" width="30%">
</p>
<p align="center"><h1 align="center">SiteEase</h1></p>
<p align="center">
	<em><code>❯ REPLACE-ME</code></em>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/Aashish17405/SiteEase?style=default&logo=opensourceinitiative&logoColor=white&color=0080ff&label=License&message=MIT" alt="MIT License">
	<img src="https://img.shields.io/github/last-commit/Aashish17405/SiteEase?style=default&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/Aashish17405/SiteEase?style=default&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/Aashish17405/SiteEase?style=default&color=0080ff" alt="repo-language-count">
</p>
<p align="center"><!-- default option, no dependency badges. -->
</p>
<p align="center">
	<!-- default option, no dependency badges. -->
</p>
<br>

## 🔗 Table of Contents

- [📍 Overview](#-overview)
- [👾 Features](#-features)
- [📁 Project Structure](#-project-structure)
  - [📂 Project Index](#-project-index)
- [🚀 Getting Started](#-getting-started)
- [🔰 Contributing](#-contributing)
- [🎗 License](#-license)

---

## 📍 Overview

**SiteEase** is a Chrome extension designed to enhance web accessibility for individuals with visual impairments and reading difficulties. It offers a suite of customizable features to make web content more inclusive and user-friendly.

---

## 👾 Features

- **OpenDyslexic Font Support:** Easily toggle a dyslexia-friendly font for improved readability.
- **Color Adjustment Modes:**
  - **Orange-Turquoise Mode:** Highlights red and green dominant colors with orange and turquoise for colorblind accessibility.
  - **Cyan-Beige Mode:** Enhances yellow-blue contrasts for better visibility.
  - **Achromatopsia Mode:** Converts web pages to grayscale to assist individuals with color perception deficiencies.
- **Real-Time Customization:** Modify web content styles dynamically without reloading the page.
- **User Preferences:** Automatically save and restore user settings for a personalized browsing experience.

With SiteEase, navigating the web becomes a seamless and empowering experience for everyone, ensuring accessibility and inclusion are at the forefront of digital interaction.

---

## 📁 Project Structure

```sh
└── SiteEase/
    ├── README.md
    ├── ToggleButton.js
    ├── content.js
    ├── icons
    │   ├── icon-128x128.png
    │   ├── icon-16x16.png
    │   ├── icon-32x32.png
    │   └── icon-48x48.png
    ├── index.css
    ├── manifest.json
    ├── popup.html
    └── popup.js
```


### 📂 Project Index
<details open>
	<summary><b><code>SITEEASE/</code></b></summary>
	<details> <!-- __root__ Submodule -->
		<summary><b>__root__</b></summary>
		<blockquote>
			<table>
			<tr>
				<td><b><a href='https://github.com/Aashish17405/SiteEase/blob/master/index.css'>index.css</a></b></td>
				<td><code>❯ Styles for the extension popup and various UI components to ensure accessibility and readability.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Aashish17405/SiteEase/blob/master/popup.html'>popup.html</a></b></td>
				<td><code>❯ The HTML structure for the Chrome extension's popup interface, allowing users to toggle accessibility features.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Aashish17405/SiteEase/blob/master/popup.js'>popup.js</a></b></td>
				<td><code>❯ Handles user interactions from the popup interface and communicates with the content script to apply accessibility features.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Aashish17405/SiteEase/blob/master/content.js'>content.js</a></b></td>
				<td><code>❯ Injected into web pages to apply accessibility modifications, such as color adjustments and font changes, dynamically.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Aashish17405/SiteEase/blob/master/manifest.json'>manifest.json</a></b></td>
				<td><code>❯ The manifest file defining the extension's metadata, permissions, and background scripts for Chrome.</code></td>
			</tr>
			<tr>
				<td><b><a href='https://github.com/Aashish17405/SiteEase/blob/master/ToggleButton.js'>ToggleButton.js</a></b></td>
				<td><code>❯ Manages the logic for toggling accessibility features, including button states and user preferences.</code></td>
			</tr>
			</table>
		</blockquote>
	</details>
</details>

---

## 🚀 Getting Started

Install SiteEase using one of the following methods:

### **Build from Source**

1. **Clone the SiteEase repository:**
```sh
git clone https://github.com/Aashish17405/SiteEase
```

2. **Navigate to the project directory:**

```sh
cd SiteEase
```

3. Load the extension in Chrome:

- Open Google Chrome and navigate to chrome://extensions/.
- Enable Developer mode using the toggle in the top-right corner.
- Click Load unpacked.
- Select the folder where your extension's source code resides (the root directory containing the manifest.json file).


## 🔰 Contributing

- **💬 [Join the Discussions](https://github.com/Aashish17405/SiteEase/discussions)**: Share your insights, provide feedback, or ask questions.
- **🐛 [Report Issues](https://github.com/Aashish17405/SiteEase/issues)**: Submit bugs found or log feature requests for the `SiteEase` project.
- **💡 [Submit Pull Requests](https://github.com/Aashish17405/SiteEase/blob/main/CONTRIBUTING.md)**: Review open PRs, and submit your own PRs.

<details closed>
<summary>Contributing Guidelines</summary>

1. **Fork the Repository**: Start by forking the project repository to your github account.
2. **Clone Locally**: Clone the forked repository to your local machine using a git client.
   ```sh
   git clone https://github.com/Aashish17405/SiteEase
   ```
3. **Create a New Branch**: Always work on a new branch, giving it a descriptive name.
   ```sh
   git checkout -b new-feature-x
   ```
4. **Make Your Changes**: Develop and test your changes locally.
5. **Commit Your Changes**: Commit with a clear message describing your updates.
   ```sh
   git commit -m 'Implemented new feature x.'
   ```
6. **Push to github**: Push the changes to your forked repository.
   ```sh
   git push origin new-feature-x
   ```
7. **Submit a Pull Request**: Create a PR against the original project repository. Clearly describe the changes and their motivations.
8. **Review**: Once your PR is reviewed and approved, it will be merged into the main branch. Congratulations on your contribution!
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/Aashish17405/SiteEase/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=Aashish17405/SiteEase">
   </a>
</p>
</details>

---

## 🎗 License

This project is protected under the [MIT License](https://choosealicense.com/licenses/mit/#) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/mit/#) file.
