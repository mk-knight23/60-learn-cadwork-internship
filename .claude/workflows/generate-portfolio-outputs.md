# Workflow: Generate Portfolio Outputs

**Purpose**: Transform completed work into portfolio-ready artifacts

**Frequency**: Run after completing each major milestone or project

---

## Workflow Steps

### Step 1: Gather Work Products

Collect all artifacts from the completed work:
- Source code commits
- Pull requests
- ADRs written
- Tests written
- Documentation created
- Demos/screenshots

### Step 2: Update Resume Bullet Points

For each completed project/task:

1. **Identify Key Achievements**
   - What problem did you solve?
   - What impact did it have?
   - What technologies did you use?
   - What metrics improved?

2. **Write Bullet Points** using STAR format:
   - **S**ituation: What was the context?
   - **T**ask: What did you need to do?
   - **A**ction: What did you do (how)?
   - **R**esult: What was the outcome?

3. **Examples**:
   - ✅ "Built automated CAD validation pipeline using Angular 21, reducing manual review time by 80% and saving engineering team 15 hours/week"
   - ✅ "Implemented comprehensive testing suite achieving 85% code coverage with Vitest, following TDD practices"
   - ✅ "Documented architectural decisions using ADR framework, improving team communication and knowledge sharing"

### Step 3: Create Project Case Study

Use `/templates/project-case-study-template.md` (to be created):

1. **Overview**: 2-3 sentence project summary
2. **Problem**: What problem did you solve?
3. **Solution**: How did you solve it?
4. **Challenges**: What was difficult?
5. **Technologies**: What did you use?
6. **Results**: What was the impact?
7. **Lessons**: What did you learn?
8. **Future Work**: What would you improve?

### Step 4: Prepare Demo Materials

1. **Screenshots**: Capture key features and workflows
2. **Demo Video**: Record 5-10 minute walkthrough
   - Introduction (1 min)
   - Problem statement (1 min)
   - Solution demo (5 min)
   - Technical highlights (2 min)
   - Conclusion (1 min)

3. **Live Deployment**: Ensure app is deployed and accessible

### Step 5: Update Portfolio

1. **GitHub Repository**:
   - Update README with project description
   - Add tags/releases for milestones
   - Organize issues and projects
   - Add contributing guidelines

2. **Portfolio Website**:
   - Add project to your portfolio
   - Include case study
   - Link to live demo
   - Embed screenshots/video

3. **LinkedIn/Resume**:
   - Add project to experience
   - Post about completion
   - Share key learnings

---

## Portfolio Output Templates

### Resume Bullet Point Generator

Ask Claude Code:

```
Generate resume bullet points for my completed project:

Project: [Project Name]
Technologies: [List technologies]
Key Features: [List main features]
Impact: [Metrics and outcomes]

Format: STAR (Situation, Task, Action, Result)
Length: 1-2 bullets
Style: Action-oriented, quantifiable impact
```

### Project Case Study Generator

Ask Claude Code:

```
Create a project case study using the template:

Project: [Project Name]
GitHub: [URL]
Live Demo: [URL]

Key accomplishments:
1. [Accomplishment 1]
2. [Accomplishment 2]
3. [Accomplishment 3]

Challenges faced:
1. [Challenge 1] - How I solved it
2. [Challenge 2] - How I solved it

Use the case study template from /templates/
```

### Achievement Summary Generator

Ask Claude Code:

```
Summarize my internship achievements for LinkedIn:

Projects completed: [List]
Skills developed: [List]
Best accomplishments: [List 2-3]

Format: Professional but conversational
Length: 2-3 paragraphs
Include: Hashtags for visibility
```

---

## Quality Checklist

Before publishing portfolio outputs:

- [ ] Resume bullets are specific and quantifiable
- [ ] Case study tells a complete story
- [ ] Demo video is clear and professional
- [ ] Screenshots are high-quality
- [ ] Live deployment is accessible
- [ ] GitHub repository is clean and documented
- [ ] All links work correctly
- [ ] Proofread for typos and grammar
- [ ] Peer review of portfolio materials

---

## Example Portfolio Outputs

See `/examples/portfolio/` for complete examples (to be added).

---

## Automation

This workflow is designed to work with Claude Code automation scripts (to be added in `/scripts/`).
