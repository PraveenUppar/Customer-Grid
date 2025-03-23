"use client";

import {
	type ExpenseByCategorySummary,
	useGetExpensesByCategoryQuery,
} from "@/state/api";
import { useMemo, useState } from "react";
import Header from "@/app/(components)/Header";
import {
	Cell,
	Legend,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";

type AggregatedDataItem = {
	name: string;
	color?: string;
	amount: number;
};

type AggregatedData = {
	[category: string]: AggregatedDataItem;
};

const Expenses = () => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [selectedCategory, setSelectedCategory] = useState("All");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	// Example data for testing
	const exampleExpenses: ExpenseByCategorySummary[] = [
		{
			expenseByCategorySummaryId: "1",
			category: "Office",
			amount: "500",
			date: "2024-03-10",
		},
		{
			expenseByCategorySummaryId: "2",
			category: "Professional",
			amount: "750",
			date: "2024-03-11",
		},
		{
			expenseByCategorySummaryId: "3",
			category: "Salaries",
			amount: "1200",
			date: "2024-03-12",
		},
		{
			expenseByCategorySummaryId: "4",
			category: "Office",
			amount: "300",
			date: "2024-03-13",
		},
	];

	// Fetch API Data (if available)
	const {
		data: expensesData,
		isLoading,
		isError,
	} = useGetExpensesByCategoryQuery();

	// Ensure example data is used if API data is not available
	const expenses = useMemo(() => {
		if (isLoading || isError || !expensesData) return exampleExpenses;
		return expensesData;
	}, [expensesData, isLoading, isError]);

	const parseDate = (dateString: string) => new Date(dateString).toISOString().split("T")[0];

	// Aggregate expenses based on category
	const aggregatedData: AggregatedDataItem[] = useMemo(() => {
		const filtered: AggregatedData = expenses
			.filter((data) => {
				const matchesCategory = selectedCategory === "All" || data.category === selectedCategory;
				const dataDate = parseDate(data.date);
				const matchesDate = !startDate || !endDate || (dataDate >= startDate && dataDate <= endDate);
				return matchesCategory && matchesDate;
			})
			.reduce((acc: AggregatedData, data) => {
				const amount = Number.parseInt(data.amount);

				if (!acc[data.category]) {
					acc[data.category] = {
						name: data.category,
						amount: 0,
						color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
					};
				}

				acc[data.category].amount += amount;
				return acc;
			}, {});

		return Object.values(filtered);
	}, [expenses, selectedCategory, startDate, endDate]);

	// Extract unique categories for the dropdown
	const uniqueCategories = useMemo(() => {
		const categories = ["All", ...new Set(expenses.map((expense) => expense.category))];
		return categories;
	}, [expenses]);

	const classNames = {
		label: "block text-sm font-medium text-gray-700",
		selectInput: "mt-1 block w-full p-2 border rounded-md",
	};

	return (
		<div>
			{/* HEADER */}
			<div className="mb-5">
				<Header name="Rewards" />
				<p className="text-sm text-gray-500">A visual representation of rewards over time.</p>
			</div>

			{/* FILTERS */}
			<div className="flex flex-col md:flex-row justify-between gap-4">
				<div className="w-full md:w-1/3 bg-white shadow rounded-lg p-6">
					<h3 className="text-lg font-semibold mb-4">Filter by Category and Date</h3>
					<div className="space-y-4">
						{/* CATEGORY */}
						<div>
							<label htmlFor="category" className={classNames.label}>Category</label>
							<select
								id="category"
								name="category"
								className={classNames.selectInput}
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
							>
								{uniqueCategories.map((category) => (
									<option key={category} value={category}>{category}</option>
								))}
							</select>
						</div>
					</div>
				</div>

				{/* PIE CHART */}
				<div className="flex-grow bg-white shadow rounded-lg p-4 md:p-6">
					<ResponsiveContainer width="100%" height={400}>
						<PieChart>
							<Pie
								data={aggregatedData}
								cx="50%"
								cy="50%"
								label
								outerRadius={150}
								fill="#8884d8"
								dataKey="amount"
								onMouseEnter={(_, index) => setActiveIndex(index)}
							>
								{aggregatedData.map((entry, index) => (
									<Cell key={entry.name} fill={index === activeIndex ? "rgb(29, 78, 216)" : entry.color} />
								))}
							</Pie>
							<Tooltip />
							<Legend />
						</PieChart>
					</ResponsiveContainer>
				</div>
			</div>
		</div>
	);
};

export default Expenses;
