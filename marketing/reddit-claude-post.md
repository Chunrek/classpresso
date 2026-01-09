# Reddit Post for r/ClaudeAI

## Flair

`Built with Claude`

## Title

The weird Tailwind paradox: AI usage is exploding but Tailwind (the company) is struggling

---

## Post

Something interesting I've noticed while building with Claude.

Every time I ask Claude to make a component, it spits out beautiful Tailwind:

```html
<button class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors">
```

And it's *consistent*. Like, scary consistent. Ask for 10 different buttons across a project and you'll get nearly identical class patterns every time.

This got me thinking about an article I read - Tailwind the company has apparently dropped significantly in value. The theory? AI generates Tailwind so well that nobody needs to buy their premium UI kits and templates anymore. Usage through the roof, revenue down. Bizarre.

**But there's a flip side nobody talks about:**

All this AI-generated Tailwind creates massive redundancy. I checked one of my Claude-built projects - same 15-class button pattern repeated 47 times. Same card pattern 23 times. The browser has to parse and match every single one of those classes on every render.

Has anyone else noticed this? I started wondering if there's a performance cost to all this repetition.

**What I ended up building (full disclosure: my project):**

I made an open-source tool called Classpresso that consolidates these repeated patterns at build time. So those 47 identical buttons become `class="cp-a"` with one CSS rule.

The nerdy part - I included an `AI-INSTRUCTIONS.md` file in the npm package specifically so Claude can understand how to use it and run benchmarks. You can literally paste the file contents and Claude gets it immediately.

It's free/MIT licensed, just thought it might be useful for others hitting the same issue: https://github.com/timclausendev-web/classpresso

---

**But mainly I'm curious:** Has anyone else noticed how repetitive Claude's Tailwind output is? And do you think this AI-Tailwind dynamic is going to change how we think about utility CSS?
