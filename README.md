![Ink Color Contrast](/images/ICC_cover.jpg "TodayFeed Cover")


# Ink Contrast Checker (ICC) Figma Plugin


### **What does ICC Figma Plugin do?**
Ink Color Contrast ICC is a Figma plugin that helps designers and developers make sure there's enough contrast between a foreground and a background color when viewed by someone with low-vision or color blindness. This ensures that users regardless of their vision deficiency get a usable and accessible experience.

***

### **What are some of ICC Figma Plugin's features?**

- Allows users to select two layers and check the color contrast between them
- Allows users to swap the foreground and background colors 
- Provides users with a contrast ratio score based on WCAG guidelines

***

#### **How does it check color contrast?**

ICC checks color contrast by calculating luminance, which is the apparent brightness of a color.

Following WCAG 2.0 guidelines, we first get the relative luminance value of the two colors.
by stripping the hue and saturation from the color and all that remains is the brightness of it. We then find the difference between the two luminance values by dividing the larger luminance value by the smaller value. The resulting number represents the contrast between the two colors.

Read more [here](https://www.w3.org/WAI/GL/wiki/Relative_luminance)

***

### **Unsolved Problems**
-  Based on the tutorial I followed to create this plugin, the CSS is in placed inside `<style>` tags, the JS is placed inside `<script>` tags and SVGs are all included inside the HTML file. I tried to split them into separate files and use a webpack bundler to put them in a single JS and HTML file that Figma could read, but I was unable to make the plugin work that way. 

***

### **Information on WCAG**
WCAG (Web Content Accessibility Guidelines) ensure that content is accessible by everyone, regardless of disability or user device. To meet these standards, text and interactive elements should have a color contrast ratio of at least 4.5:1. This ensures that viewers who cannot see the full color spectrum are able to read the text. 

WCAG 2.0 level AA requires a contrast ratio of at least 4.5:1 for normal text and 3:1 for large text. WCAG 2.1 requires a contrast ratio of at least 3:1 for graphics and user interface components. WCAG Level AAA requires a contrast ratio of at least 7:1 for normal text and 4.5:1 for large text.

Read more [here](https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html)
