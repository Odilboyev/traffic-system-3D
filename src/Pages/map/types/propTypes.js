import PropTypes from "prop-types";

export const MarkerPropTypes = {
  cid: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export const ModalPropTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export const MapControlsPropTypes = {
  theme: PropTypes.string.isRequired,
  toggleTheme: PropTypes.func.isRequired,
  activeSidePanel: PropTypes.string,
  setActiveSidePanel: PropTypes.func.isRequired,
  filter: PropTypes.object.isRequired,
  setFilter: PropTypes.func.isRequired,
};
