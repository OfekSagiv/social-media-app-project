document.addEventListener('DOMContentLoaded', async () => {
  const loadingToast = toast.loading('Loading statistics...');

  try {
    const postsRes = await fetch('/api/statistics/posts-per-day', {
      credentials: 'include'
    });
    if (!postsRes.ok) {
      throw new Error(`Failed to fetch posts data: ${postsRes.status}`);
    }
    const postsData = await postsRes.json();

    const usersRes = await fetch('/api/statistics/users-per-day', {
      credentials: 'include'
    });
    if (!usersRes.ok) {
      throw new Error(`Failed to fetch users data: ${usersRes.status}`);
    }
    const usersData = await usersRes.json();

    toast.hide(loadingToast);

    if (!postsData || postsData.length === 0) {
      toast.warning('No posts data available for the selected period');
    } else {
      drawBarChart(postsData, '#postsChart');
    }

    if (!usersData || usersData.length === 0) {
      toast.warning('No users data available for the selected period');
    } else {
      drawLineChart(usersData, '#usersChart');
    }

    toast.success('Statistics loaded successfully!');

  } catch (error) {
    console.error('Error loading statistics data:', error);
    toast.hide(loadingToast);
    toast.error('Failed to load statistics data. Please check your connection and try again.');
  }
});

function drawBarChart(data, selector) {
  try {
    const svg = d3.select(selector);
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const x = d3.scaleBand()
      .domain(data.map(d => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-40)")
      .style("text-anchor", "end");

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', d => x(d.date))
      .attr('y', d => y(d.count))
      .attr('height', d => y(0) - y(d.count))
      .attr('width', x.bandwidth())
      .attr('fill', '#4285f4');
  } catch (error) {
    console.error('Error drawing bar chart:', error);
    toast.error('Error rendering posts chart');
  }
}

function drawLineChart(data, selector) {
  try {
    const svg = d3.select(selector);
    const width = +svg.attr('width');
    const height = +svg.attr('height');
    const margin = { top: 20, right: 20, bottom: 40, left: 40 };

    const parseDate = d3.timeParse('%Y-%m-%d');
    data.forEach(d => d.date = parseDate(d.date));

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count)]).nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => x(d.date))
      .y(d => y(d.count));

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickFormat(d3.timeFormat('%b %d')));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#34a853')
      .attr('stroke-width', 2)
      .attr('d', line);
  } catch (error) {
    console.error('Error drawing line chart:', error);
    toast.error('Error rendering users chart');
  }
}
