import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/common/Button';
import { useCSVGenerator } from '../../hooks/useCSVGenerator';
import { templates, templateCategories } from './Templates';

const TemplateSelector = ({ onSelectTemplate, basic = false, rowCount = 100 }) => {
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const { generateCSV, generatingStatus, error } = useCSVGenerator();

  // Handle template selection
  const handleSelectTemplate = () => {
    if (!selectedTemplate) return;

    const template = templates.find(t => t.id === selectedTemplate);
    if (template) {
      onSelectTemplate(template);
    }
  };

  // Download template as CSV
  const handleDownloadTemplate = async (templateId) => {
    if (!selectedTemplate && !templateId) return;

    const downloadTemplateId = templateId || selectedTemplate;
    const template = templates.find(t => t.id === downloadTemplateId);
    if (!template) return;

    try {
      const templateToGenerate = {
        ...template,
        rowCount: basic ? rowCount : template.rowCount
      };
      
      // Generate sample data
      const sampleData = await generateCSV(templateToGenerate);

      // Convert data to CSV
      const headers = template.columns.map(col => col.name).join(',');
      const rows = sampleData.map(row =>
        template.columns.map(col => {
          const value = row[col.name];
          // Quote strings that contain commas
          return typeof value === 'string' && value.includes(',')
            ? `"${value}"`
            : value;
        }).join(',')
      );

      const csvContent = [headers, ...rows].join('\n');

      // Create download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${template.id}-${rowCount}rows.csv`;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating CSV: ", error);
    }
  };

  return (
    <div>
      {basic ? (
        <div className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {Object.entries(templateCategories).map(([category, templateIds]) => (
              <div key={category} className="bg-accent/10 dark:bg-gray-750/30 p-4 rounded border border-accent-200 dark:border-gray-600">
                <h3 className="text-sm font-medium text-text-900 dark:text-gray-300 mb-3">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {templateIds.map(id => {
                    const template = templates.find(t => t.id === id);
                    return template ? (
                      <Button
                        key={template.id}
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadTemplate(template.id)}
                        title={template.description}
                      >
                        {template.name}
                      </Button>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label htmlFor="templateSelect" className="block text-sm font-medium mb-1 text-text-900 dark:text-gray-300">
              Select a predefined template
            </label>
            <select
              id="templateSelect"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="w-full p-2 border border-border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-text-900 dark:text-gray-100"
            >
              <option value="">-- Select Template --</option>

              {/* Group templates by category */}
              {Object.entries(templateCategories).map(([category, templateIds]) => (
                <optgroup key={category} label={category}>
                  {templateIds.map(id => {
                    const template = templates.find(t => t.id === id);
                    return template ? (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ) : null;
                  })}
                </optgroup>
              ))}
            </select>
          </div>

          {selectedTemplate && (
            <div className="mb-4 p-3 bg-accent/20 dark:bg-gray-700/30 rounded border border-accent-200 dark:border-gray-600">
              <h3 className="font-medium text-primary dark:text-primary-300 mb-1">
                {templates.find(t => t.id === selectedTemplate)?.name}
              </h3>
              <p className="text-sm text-text-600 dark:text-gray-400 mb-2">
                {templates.find(t => t.id === selectedTemplate)?.description}
              </p>
              <div className="text-xs text-text-500 dark:text-gray-500">
                {templates.find(t => t.id === selectedTemplate)?.columns.length} columns,
                {templates.find(t => t.id === selectedTemplate)?.rowCount} rows
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              onClick={handleSelectTemplate}
              disabled={!selectedTemplate}
              className="flex-1 disabled:opacity-50"
            >
              Load Template
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

TemplateSelector.propTypes = {
  onSelectTemplate: PropTypes.func.isRequired,
  basic: PropTypes.bool,
  rowCount: PropTypes.number
};

export default TemplateSelector;