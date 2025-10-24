Text file: README.md
Latest content with line numbers:
1	# 📓 Jupyter Notebooks - GitHub Language Analysis
2	
3	This directory contains a comprehensive suite of Jupyter notebooks for analyzing GitHub repository data across 12 programming languages.
4	
5	## 📚 Notebook Overview
6	
7	### 🎯 Start Here: `00_master_index.ipynb`
8	**Your complete guide to the analysis**
9	- Project overview and structure
10	- Dataset summary
11	- Recommended workflow
12	- Quick start examples
13	
14	### 📊 Core Analysis Notebooks
15	
16	#### 1️⃣ `01_data_exploration.ipynb`
17	**Initial data exploration and quality assessment**
18	
19	**Contents:**
20	- Load and inspect the dataset (1,200+ repositories)
21	- Data quality checks and missing value analysis
22	- Distribution analysis for all metrics
23	- Language distribution pie charts and bar charts
24	- Top repositories identification
25	- Health indicator analysis (README, license, etc.)
26	- Key insights summary
27	
28	**Output:** Foundation understanding of the dataset
29	
30	---
31	
32	#### 2️⃣ `02_language_comparison.ipynb`
33	**Compare programming languages across dimensions**
34	
35	**Contents:**
36	- Language rankings by overall, popularity, activity, and health scores
37	- Statistical significance testing (ANOVA)
38	- Box plots showing score distributions by language
39	- Radar charts for top 5 languages
40	- Total vs average stars analysis
41	- Language strengths and weaknesses identification
42	- Performance heatmap matrix
43	- Exportable comparison summary table
44	
45	**Output:** Clear rankings and language performance insights
46	
47	---
48	
49	#### 3️⃣ `03_correlation_analysis.ipynb`
50	**Explore relationships between metrics**
51	
52	**Contents:**
53	- Full correlation matrix with heatmap
54	- Stars vs Forks scatter analysis (linear and log scale)
55	- Popularity vs Activity quadrant analysis
56	- Contributors impact on overall score
57	- Health indicator effectiveness testing
58	- Pair plots for key metrics
59	- Score component relationship analysis
60	- Multi-variate correlation insights
61	
62	**Output:** Understanding of what drives repository success
63	
64	---
65	
66	#### 4️⃣ `04_advanced_visualizations.ipynb`
67	**Publication-ready and interactive visualizations**
68	
69	**Contents:**
70	- Executive dashboard with comprehensive metrics
71	- Interactive Plotly bubble charts (HTML export)
72	- Sunburst hierarchy charts by category
73	- 3D scatter plots (Popularity × Activity × Health)
74	- Animated timeline of language growth
75	- Parallel coordinates for top repositories
76	- Treemap of top repos by language
77	- Performance gauge charts
78	
79	**Output:** Professional visualizations for presentations and reports
80	
81	---
82	
83	## 🗂️ File Structure
84	
85	```
86	notebooks/
87	├── 00_master_index.ipynb              # Start here - Complete guide
88	├── 01_data_exploration.ipynb          # Data quality and basics
89	├── 02_language_comparison.ipynb       # Language rankings
90	├── 03_correlation_analysis.ipynb      # Relationships and patterns
91	├── 04_advanced_visualizations.ipynb   # Publication visuals
92	└── README.md                          # This file
93	```
94	
95	## 🚀 Quick Start
96	
97	### Option 1: Sequential Analysis (Recommended)
98	Run notebooks in order for complete understanding:
99	```bash
100	1. 00_master_index.ipynb       # Get oriented
101	2. 01_data_exploration.ipynb   # Understand the data
102	3. 02_language_comparison.ipynb # Compare languages
103	4. 03_correlation_analysis.ipynb # Find relationships
104	5. 04_advanced_visualizations.ipynb # Create visuals
105	```
106	
107	### Option 2: Jump to Specific Analysis
108	- **Just want rankings?** → `02_language_comparison.ipynb`
109	- **Need visualizations?** → `04_advanced_visualizations.ipynb`
110	- **Understanding correlations?** → `03_correlation_analysis.ipynb`
111	- **First time here?** → `00_master_index.ipynb`
112	
113	## 📦 Prerequisites
114	
115	### Required Python Libraries
116	```bash
117	pip install pandas numpy matplotlib seaborn plotly scipy scikit-learn jupyter
118	```
119	
120	### Data Files Required
121	Ensure these exist in `../data/processed/`:
122	- `all_languages_combined.csv` - Main dataset
123	- `overall_summary.json` - Summary statistics
124	- Individual language files (optional)
125	
126	## 📊 What You'll Learn
127	
128	### Data Analysis Skills
129	- ✅ Exploratory Data Analysis (EDA)
130	- ✅ Statistical testing (ANOVA, t-tests, correlation)
131	- ✅ Data cleaning and validation
132	- ✅ Multi-dimensional analysis
133	
134	### Visualization Skills
135	- ✅ Static charts (Matplotlib, Seaborn)
136	- ✅ Interactive plots (Plotly)
137	- ✅ Dashboard creation
138	- ✅ Publication-quality graphics
139	
140	### Programming Skills
141	- ✅ Pandas data manipulation
142	- ✅ NumPy numerical operations
143	- ✅ Jupyter notebook workflows
144	- ✅ Code documentation
145	
146	## 🎨 Visualizations Created
147	
148	### Static Visualizations (PNG)
149	- Language rankings bar charts
150	- Score distribution box plots
151	- Correlation heatmaps
152	- Radar charts for comparisons
153	- Executive dashboard panel
154	- Scatter plots with regression lines
155	
156	### Interactive Visualizations (HTML)
157	- Bubble charts with hover data
158	- 3D scatter plots (rotatable)
159	- Sunburst hierarchical charts
160	- Animated timelines
161	- Parallel coordinates
162	- Treemaps
163	- Gauge charts
164	
165	**Location:** All saved to `../data/exports/visualizations/`
166	
167	## 📈 Key Metrics Analyzed
168	
169	### Popularity Metrics
170	- Stars, Forks, Watchers
171	- Normalized popularity scores
172	
173	### Activity Metrics
174	- Commits (30d, 90d, 365d windows)
175	- Contributors count
176	- Recent activity indicators
177	
178	### Health Metrics
179	- README presence
180	- License presence
181	- Contributing guidelines
182	- Code of conduct
183	
184	### Composite Scores
185	- Overall score (weighted average)
186	- Popularity score (40% weight)
187	- Activity score (35% weight)
188	- Health score (25% weight)
189	
190	## 🎯 Research Questions Answered
191	
192	1. **Which languages have the healthiest repositories?**
193	   → See `02_language_comparison.ipynb`
194	
195	2. **What factors predict repository success?**
196	   → See `03_correlation_analysis.ipynb`
197	
198	3. **How do popularity and activity relate?**
199	   → See `03_correlation_analysis.ipynb`
200	
201	4. **Which languages are growing fastest?**
202	   → See `04_advanced_visualizations.ipynb` (timeline)
203	
204	5. **What's the best language for my project?**
205	   → See all notebooks for comprehensive view
206	
207	## 💡 Tips for Success
208	
209	### Running Notebooks
210	1. **Run cells sequentially** - Dependencies exist between cells
211	2. **Check data paths** - Adjust if your structure differs
212	3. **Install all libraries** - Missing packages will cause errors
213	4. **Allow time for visualizations** - Some plots take time to render
214	
215	### Customization
216	- Modify `score_columns` lists to focus on specific metrics
217	- Change `top_n` variables to show more/fewer results
218	- Adjust plot sizes by changing `figsize` parameters
219	- Modify color schemes by changing `cmap` or `palette` values
220	
221	### Exporting Results
222	- Static plots: `plt.savefig('filename.png', dpi=300)`
223	- Interactive plots: `fig.write_html('filename.html')`
224	- Data frames: `df.to_csv('filename.csv')`
225	
226	## 🔧 Troubleshooting
227	
228	### Common Issues
229	
230	**Issue:** "File not found" error
231	**Solution:** Check data paths, ensure you're in notebooks/ directory
232	
233	**Issue:** Missing library import error
234	**Solution:** `pip install [library_name]`
235	
236	**Issue:** Plots not displaying
237	**Solution:** Ensure `%matplotlib inline` is executed
238	
239	**Issue:** Slow performance
240	**Solution:** Reduce sample sizes or use data subsets
241	
242	### Performance Tips
243	- Use `.sample()` for large datasets during testing
244	- Close unused notebook kernels
245	- Clear output before saving notebooks
246	- Use appropriate plot libraries (static vs interactive)
247	
248	## 📚 Additional Resources
249	
250	### Documentation
251	- [Pandas Documentation](https://pandas.pydata.org/docs/)
252	- [Matplotlib Gallery](https://matplotlib.org/stable/gallery/)
253	- [Seaborn Tutorial](https://seaborn.pydata.org/tutorial.html)
254	- [Plotly Documentation](https://plotly.com/python/)
255	
256	### Learning Materials
257	- [Jupyter Notebook Basics](https://jupyter-notebook.readthedocs.io/)
258	- [Python Data Science Handbook](https://jakevdp.github.io/PythonDataScienceHandbook/)
259	- [Exploratory Data Analysis Guide](https://www.kaggle.com/learn/data-visualization)
260	
261	## 🎓 Project Context
262	
263	This analysis was created as part of a data analysis capstone project to:
264	- Demonstrate real-world data analysis skills
265	- Practice working with APIs and large datasets
266	- Create portfolio-ready visualizations
267	- Learn statistical analysis techniques
268	- Communicate technical findings effectively
269	
270	## 📝 Notes
271	
272	- All analysis uses actual GitHub data (not simulated)
273	- Scoring methodology is documented in main README.md
274	- Visualizations are publication-ready
275	- Code is well-commented for learning purposes
276	- Interactive HTML files work in any modern browser
277	
278	## 🌟 Next Steps
279	
280	1. **Run the notebooks** - Start with `00_master_index.ipynb`
281	2. **Customize analysis** - Modify to answer your questions
282	3. **Create new notebooks** - Extend the analysis
283	4. **Share findings** - Use visualizations in presentations
284	5. **Learn more** - Dive deeper into interesting patterns
285	
286	---
287	
288	**Happy Analyzing! 📊🚀**
289	
290	For questions or issues, refer to the main project README.md or review the documentation in each notebook.
291	