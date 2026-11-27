import {t,a,q,practice as p} from './authoring.mjs';
export default {
 number:5,
 topics:[
 t('5.1.1','Mean, median and mode',[67,68],`Data analytics examines data for useful patterns and information. Descriptive statistics summarise a collection of values. A measure of central tendency describes its centre or typical value, but different measures answer different questions.

The mean is the sum divided by the number of values. For 50, 60, 70, 80 and 90, the sum is 350 and the mean is 70. The median is the middle of the sorted data. With an even number of values, average the two middle values: the median of 50, 60, 70 and 80 is (60 + 70) / 2 = 65.

The mode is the most frequent value. In 50, 60, 70, 70 and 90, the mode is 70. More than one value can share the greatest frequency; the book illustrates a dataset with modes 60 and 70. Sorting is necessary to locate a median correctly, but it does not change the sum used for a mean.

For the supplied model-paper scores 40, 50, 60, 70, 80 and 90, the middle two values are 60 and 70. The median is 65. It is not the average of just the smallest and largest values as a general rule; those happen to give the same value in this evenly spaced example.`),
 t('5.1.2','Population variance and standard deviation',[68,69,70],`Measures of dispersion describe spread around the centre. The population variance formula used in the book is the sum of squared deviations from the mean divided by N, the number of values. Standard deviation is the square root of that variance and uses the original measurement unit.

Follow four steps: find the mean, subtract it from each value, square and add those deviations, and divide by N. Take the square root for standard deviation. Squaring prevents positive and negative deviations from cancelling. All equal values have variance zero.

| Book dataset | Mean | Population variance | Standard deviation, approximately |
| --- | ---: | ---: | ---: |
| Class A: 50, 52, 55, 57, 60 | 54.8 | 12.56 | 3.5440 |
| Class B: 30, 45, 55, 75, 90 | 59 | 454 | 21.3073 |

Class B is more spread out. The standard-deviation approximations printed on page 70 do not exactly match the printed variances; the values above are calculated from those variances and checked with Python. To two decimal places they are 3.54 and 21.31. Do not confuse the square-root step with squaring again, or replace the book's population denominator N with a different formula without stating a different statistical assumption.`),
 t('5.1.3','Probability',[70,71],`Probability describes how likely an event is. For a finite set of equally likely outcomes, divide the number of favourable outcomes by the total number of possible outcomes. The equally likely condition matters; counting outcomes alone does not justify treating an unfair process as fair.

For a fair coin, one of the two outcomes is heads, so P(heads) is 1/2. For a fair six-sided die, the even outcomes are 2, 4 and 6, giving probability 3/6 = 1/2. A probability lies from 0 to 1, where 0 represents an impossible event in the stated model and 1 a certain event.

An observed frequency and a probability model are related but are not identical promises about a particular short run. Ten fair-coin tosses are not guaranteed to contain exactly five heads. Explain the possible outcomes and favourable event before writing a fraction.`),
 t('5.2','Collecting, preparing and cleaning data',[71,72,73,74],`Choose a data-collection method that suits the question. A survey asks a defined set of questions to respondents. Observation records what happens without deliberately changing the condition being studied. An experiment deliberately changes a condition and compares its effect with an appropriate comparison.

For a school canteen, a preference questionnaire is a survey; recording which counter students choose is observation; comparing service times under two planned arrangements is an experiment. Explain what is measured and how the method answers the research question.

Data preparation checks and organises collected values into a usable form. Cleaning deals with errors, duplicates, inconsistent entries and missing values. Transformation changes the representation, such as standardising a format or summarising values by class. A changed format should not silently change the underlying meaning.

The book presents removal, estimated values and flagging as options for missing data. An estimate is not an observed result and must be identified as such. For an actual student mark, keep a missing mark visible and seek the genuine record rather than silently presenting a class average as the student's earned mark. State how a cleaning or missing-data decision may affect the analysis.

Handling missing data in section 5.2.3.3 remains included at the beginning of page 74; the excluded section 5.3 starts later on that page. Statistical-model construction is not part of this guide.`),
 t('5.4.1.1-5.4.1.4','Retained visualisations',[79,80,81],`A visualisation represents data through marks such as bars, lines or points. Choose a display that fits the question, label it clearly and interpret the pattern in the data rather than assuming that an attractive chart proves a claim.

| Display | Main use | Original study example |
| --- | --- | --- |
| Bar chart | Compare categories | Number of learners choosing each subject |
| Line graph | Show change across an ordered time scale | Temperature readings through a day |
| Histogram | Show frequencies in numerical intervals | Counts of exam marks in score ranges |
| Scatterplot | Show paired values of two variables | Study hours paired with a mark for each learner |

A bar chart's categories are different from the numerical bins of a histogram. A line graph requires a meaningful ordering of its horizontal scale. Each scatterplot point represents one paired observation; it is not two unrelated lists of measurements.

A chart can make a pattern easier to see but cannot repair missing or incorrect data. A visible association in a scatterplot does not by itself establish that one variable caused the other. The excluded boxplot subsection is not included in the exam-preparation material.`),
 t('5.5','Tools, labels and interpretation',[82,83],`The book's practical explanation uses Excel and Google Sheets: enter the data, select the relevant range, insert a suitable chart, add useful labels and interpret the result. Other visualisation tools named in the chapter include Python/Matplotlib and Tableau; they are tools, not different definitions of mean or probability.

For monthly sales, put months and their corresponding values in paired columns. Check that each value belongs to the intended month before selecting the range. Choose a line graph to emphasise change over time or a category comparison where appropriate. Label the axes and include units so that the height or position has a clear meaning.

Interpret the actual values and scale. A chart of three measured months does not by itself supply the values for an unmeasured month. A truncated or unclear axis can give a misleading impression. Keep the source data with the chart so that a reader can inspect what it represents.

These are spreadsheet practice instructions. The checked numeric examples below run in Python; they are not a claim that native Excel or Google Sheets UI actions were executed. The book prints its final chart-workflow subheading as 5.2.2 on page 83 although it appears under 5.5; its position and wording identify the retained workflow.`)
 ],
 short:[
 a(3,'Name two types of visualisation and explain when to use them.','Use a bar chart to compare values across categories, such as the number of learners selecting each subject. Use a line graph to show change over a meaningful time sequence, such as daily temperature. The choice should follow the question and data; add labels and units rather than relying on colour alone.',[79,80,83]),
 a(4,'How does visualising data help interpret descriptive statistics?','A suitable chart makes distributions, differences and trends easier to inspect. A histogram can show how many scores fall in different ranges, while a category chart can compare groups. Summary values such as a mean should be interpreted with spread and the underlying data; a visualisation can reveal information hidden by a single average.',[67,68,79,80,81])
 ],
 long:[
 a(3,'Explain the retained visualisation types and their uses.',`A bar chart compares categories by using the length or height of a bar to represent each category's value. For example, it can compare the sales of different products. A line graph connects observations in an ordered sequence, commonly time, to show a trend. Use a temperature record to illustrate why the time order matters.

A histogram groups numerical observations into intervals and shows the frequency in each interval. It is suitable for examining the distribution of exam marks. A scatterplot places one point for each pair of observations and helps inspect an association between two variables, such as study hours and marks.

Explain the data represented by the marks. A bar corresponds to a category, a histogram interval represents a numerical range and a scatter point represents a pair. These are not interchangeable merely because all use a horizontal and vertical axis.

Include a meaningful title, labelled axes, units and a suitable scale. Interpret the observed pattern without inventing unmeasured values or claiming causation from a visual association alone. The ALP removes boxplots; this answer covers the retained four types.`,[79,80,81,82,83]),
 a(4,'Explain the data-collection methods in the textbook.',`A survey collects responses to a planned set of questions. It is useful for asking a group about preferences or reported experiences. The questions should be clear and related to the research aim. For example, a shop can ask customers which products they would prefer to find in stock.

Observation records behaviour or events as they occur without deliberately changing the condition being watched. A restaurant can record which tables are selected during a defined observation period. Specify what is counted and apply the same recording method throughout.

An experiment deliberately changes a condition to investigate its effect. The book compares learning conditions for groups of students. A careful explanation identifies the changed condition, the measured result and the comparison. Other differences between the groups can affect the interpretation, so the comparison should be planned rather than assumed.

After collection, organise the data and check errors, duplicates, formats and missing values. Label any estimate and keep the distinction between observed and inferred information clear. Choosing a method and preparing the records are both necessary for a useful analysis.`,[71,72,73,74]),
 a(5,'Explain measures of central tendency with examples.',`Central tendency describes a typical or central value. The mean adds all values and divides by their number. For marks 50, 60, 70, 80 and 90, the mean is 350/5 = 70. Show the sum and denominator rather than writing an unexplained result.

The median is the middle of the sorted dataset. For five ordered values it is the third value. For an even number, average the two middle values. In 40, 50, 60, 70, 80 and 90, the median is (60 + 70)/2 = 65.

The mode is the value occurring most frequently. In 50, 60, 70, 70 and 90, it is 70. More than one value can share the greatest frequency. A mode describes frequency, while the median describes position and the mean uses every value in its total.

Use the measure that answers the question and explain the method. These measures describe centre, while variance and standard deviation describe spread. Two datasets can have the same mean and different spreads, so the mean alone is not a complete description of the data.`,[67,68,69,70])
 ],
 exerciseMcqs:[
 q(2,'Which activity belongs to experimental investigation in data science?','Systematically collecting and analysing data',['Choosing a chart colour only','Ignoring measured results','Replacing all data with guesses'],'An experiment needs a planned comparison and observed results.'),
 q(3,'Which group contains tools named for data visualisation in the chapter?','Excel, Python/Matplotlib and Tableau',['Only an arithmetic operator','Only a variable name','Only a queue removal method'],'The chapter names these tools; its detailed workflow uses spreadsheets.'),
 q(6,'Which is not a benefit of a clear data visualisation?','Making the data more difficult to understand',['Communicating insights','Showing patterns','Summarising a large collection'],'A useful display clarifies rather than deliberately obscures the information.')
 ],
 practice:[
 ...p('5.1',[67,68,69,70],[
 ['What is the mean of 50, 60, 70, 80 and 90?','70',['60','350','5'],'Their sum is 350 and there are five values.'],
 ['Find the median of 40, 50, 60, 70, 80 and 90.','65',['60','70','75'],'Average the two middle values, 60 and 70.'],
 ['What must be done before locating a median by position?','Arrange the values in order',['Replace every value with the mean','Remove the greatest frequency','Square every value'],'The middle positions are defined in the sorted order.'],
 ['Which value is the mode of 2, 4, 4, 6?','4',['2','6','16'],'The value 4 has the highest frequency.'],
 ['Can a dataset have two modes?','Yes, if two values share the greatest frequency',['No, by definition','Only if there are no values','Only if the mean is zero'],'The book explicitly gives a multiple-mode example.'],
 ['Which measure describes spread around the mean?','Variance',['Only the median\'s position','The category name','The chart title'],'Variance uses squared deviations.'],
 ['How is standard deviation obtained from population variance?','Take its square root',['Square it again','Always divide by two','Add the mean to it'],'The square-root step returns to the measurement\'s original unit.'],
 ['For all-equal numeric observations, what is the population variance?','0',['1','The number of observations','The sum of all observations'],'Every deviation from the common mean is zero.'],
 ['In the equally likely model of a fair coin, what is P(heads)?','1/2',['0','1','2'],'One favourable outcome is counted among two equally likely outcomes.'],
 ['Which condition is needed for favourable-outcome count divided by total-outcome count?','The outcomes being counted are equally likely',['Every outcome must occur in each short trial','There can be no repeated trial','The probability must exceed one'],'Counting alone does not justify equal probabilities for an unfair process.']]),
 ...p('5.2',[71,72,73,74],[
 ['Asking customers a planned set of preference questions is which method?','Survey',['Observation without questions','A deliberate intervention by itself','Data sorting only'],'A survey collects respondents\' answers.'],
 ['Watching which tables customers select without changing the arrangement is which method?','Observation',['A survey questionnaire','An automatic proof of causation','A data-format conversion'],'The researcher records behaviour without the stated intervention.'],
 ['What distinguishes an experiment from simple observation?','A condition is deliberately changed to study an effect',['It never measures an outcome','It uses no comparison','It replaces every observation with an opinion'],'An experiment plans a changed condition and measures relevant results.'],
 ['Removing confirmed duplicate records is an example of what?','Data cleaning',['Adding a chart axis','Creating a new probability outcome','Changing a queue\'s service order'],'Cleaning addresses problems in the collected records.'],
 ['Converting inconsistent date representations to one agreed format is which step?','Data transformation',['Deleting the research question','Proving every source is reliable','Replacing observed scores with invented ones'],'Transformation standardises a representation without changing its intended meaning.'],
 ['How should an estimated missing value be represented?','Label it as an estimate',['Present it as an observed mark','Hide that it was missing','Always call it zero without explanation'],'The distinction between observed and estimated information must remain clear.'],
 ['What is one transparent response to a missing mark?','Flag it as missing while seeking the actual record',['Silently award the class mean as an earned mark','Copy another learner\'s name','Claim it was measured twice'],'The book includes flagging among missing-data options.'],
 ['What should determine the choice of collection method?','The research objective and required data',['Only the prettiest chart colour','The highest available file size','A desire to avoid recording results'],'The method should answer the actual question.']]),
 ...p('5.4.1.1-5.4.1.4',[79,80,81],[
 ['Which display best compares counts for several different categories?','Bar chart',['Only a list of unlabelled dots','A time line with no meaningful time order','A single unexplained average'],'Bars provide a direct category comparison.'],
 ['Which display is especially suitable for temperature changes over a day?','Line graph',['An unordered category list alone','A stack-operation trace','An unlabelled total only'],'The ordered time scale supports a trend display.'],
 ['What does a histogram group numerical observations into?','Intervals or bins',['Only named persons','Parent-child nodes','Program modules'],'The frequency in each numerical interval is shown.'],
 ['What does one scatterplot point normally represent?','A paired observation of two variables',['Two unrelated entire datasets','A mandatory causal law','A text label with no value'],'Its horizontal and vertical coordinates belong to the same observation.'],
 ['Does a scatterplot association alone prove causation?','No',['Yes, whenever points slope upward','Yes, if a bright colour is used','Only if every point has a label'],'A visible association is not by itself a causal demonstration.'],
 ['Which distinction is correct?','A histogram uses numerical intervals; a bar chart compares categories',['Both must always use time on the horizontal axis','A scatterplot has no paired values','A line graph cannot show change'],'The display should match the organisation of the data.'],
 ['What must be clear for a chart value to be interpreted?','Its labels, units and scale',['Only its background decoration','Only the application logo','The order of software installation'],'Unlabelled or unclear axes can mislead.'],
 ['Can a clear chart repair incorrect source measurements?','No',['Yes, automatically','Yes, if all bars have equal width','Only when it uses a line'],'Visual clarity does not correct the underlying records.']]),
 ...p('5.5',[82,83],[
 ['What comes before inserting a chart from a spreadsheet range?','Enter and select the appropriate paired data',['Delete all numerical values','Choose a title without any data','Replace the research aim with a colour'],'The chart must refer to the intended range and matching observations.'],
 ['Which two tools receive the book\'s detailed spreadsheet workflow?','Excel and Google Sheets',['A stack and a queue','A compiler and an interpreter','Only a file extension and a variable'],'The retained section demonstrates chart creation with these spreadsheets.'],
 ['What should a monthly-sales chart retain alongside it?','The source values used to draw it',['Only its colours','Only a predicted month not measured','No record of the selected range'],'Keeping the source data makes the display inspectable.'],
 ['A chart contains measured values for three months. Does it supply a fourth month\'s value automatically?','No',['Yes, exactly','Only if its title is longer','Only if the bars are blue'],'An unmeasured observation is not created by displaying the measured ones.']])
 ],
 programs:[
 {id:'central-tendency',title:'Check mean, median, modes and the model-paper median',code:'import statistics\n\nvalues = [2, 4, 4, 6]\nprint(statistics.mean(values))\nprint(statistics.median(values))\nprint(statistics.multimode(values))\nprint(statistics.median([40, 50, 60, 70, 80, 90]))\n',stdout:'4\n4.0\n[4]\n65.0\n',pages:[67,68]},
 {id:'population-spread',title:'Check the book\'s variance examples and corrected square roots',code:'import statistics\n\nfor values in ([50, 52, 55, 57, 60], [30, 45, 55, 75, 90]):\n    print(f"Mean: {statistics.mean(values):.2f}")\n    print(f"Variance: {statistics.pvariance(values):.2f}")\n    print(f"SD: {statistics.pstdev(values):.4f}")\n',stdout:'Mean: 54.80\nVariance: 12.56\nSD: 3.5440\nMean: 59.00\nVariance: 454.00\nSD: 21.3073\n',pages:[68,69,70]}
 ]
};
