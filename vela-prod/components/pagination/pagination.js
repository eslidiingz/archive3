const Pagination = ({numLinks = [], onChangePage, currentPage = 1}) => {
    return (
        <div className="text-right mt-5">
        <ul>
          <li>
            <button type="button" className={`btn btn-${(numLinks?.length > 1 && currentPage > 1) ? 'primary' : 'secondary'} pagination-item-pad ${(numLinks?.length > 1 && currentPage > 1) ? '' : 'cursor-not-allowed'}`} disabled={(numLinks?.length > 0 && currentPage > 1) ? false : true} onClick={() => onChangePage(currentPage - 1)}><i className="fas fa-angle-left" /></button>
              {Array.isArray(numLinks) && numLinks.map((numLink, index) => (
                <button type="button" className={`btn btn-${currentPage === numLink.no ? 'primary' : 'secondary'} pagination-item-pad ${currentPage !== numLink.no ? '' : 'cursor-not-allowed'}`} disabled={currentPage === numLink.no} onClick={() => onChangePage(numLink.no)} key={`NumLink-${index}`}>{numLink.no}</button>
              ))}
            <button type="button" className={`btn btn-${(numLinks?.length > 1 && currentPage < numLinks.length) ? 'primary' : 'secondary'} pagination-item-pad ${(numLinks?.length > 1 && currentPage < numLinks.length) ? '' : 'cursor-not-allowed'}`} disabled={(numLinks?.length > 0 && currentPage < numLinks.length) ? false : true} onClick={() => onChangePage(currentPage + 1)}><i className="fas fa-angle-right" /></button>
          </li>
        </ul>
      </div>
    )
};

export default Pagination;